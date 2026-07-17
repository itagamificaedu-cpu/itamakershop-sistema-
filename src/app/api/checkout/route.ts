import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Preference } from "mercadopago";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMpClient } from "@/lib/mercadopago";
import { z } from "zod";

const shippingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Você precisa estar logado para finalizar a compra" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = shippingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Dados de entrega inválidos", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const shipping = validation.data;

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: session.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { message: "Seu carrinho está vazio" },
        { status: 400 }
      );
    }

    for (const item of cartItems) {
      if (item.product.inventory < item.quantity) {
        return NextResponse.json(
          { message: `Estoque insuficiente para "${item.product.name}"` },
          { status: 400 }
        );
      }
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shippingCost = subtotal > 100 ? 0 : 10;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        shippingAddress: JSON.stringify(shipping),
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: session.user.id } });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const preferenceItems = cartItems.map((item) => ({
      id: item.productId,
      title: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: "BRL",
    }));

    if (shippingCost > 0) {
      preferenceItems.push({
        id: "shipping",
        title: "Frete",
        quantity: 1,
        unit_price: shippingCost,
        currency_id: "BRL",
      });
    }

    const preference = new Preference(getMpClient());
    const result = await preference.create({
      body: {
        items: preferenceItems,
        payer: {
          name: shipping.firstName,
          surname: shipping.lastName,
          email: shipping.email,
        },
        external_reference: order.id,
        back_urls: {
          success: `${baseUrl}/checkout/success?order_id=${order.id}`,
          pending: `${baseUrl}/checkout/success?order_id=${order.id}`,
          failure: `${baseUrl}/checkout/success?order_id=${order.id}`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: result.id },
    });

    return NextResponse.json({
      orderId: order.id,
      initPoint: result.init_point,
    });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
    return NextResponse.json(
      { message: "Erro ao processar checkout" },
      { status: 500 }
    );
  }
}
