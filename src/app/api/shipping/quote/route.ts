import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isLocalDelivery,
  quoteMelhorEnvioFreight,
  LOCAL_DELIVERY_FEE,
  normalizeCep,
} from "@/lib/shipping";
import { z } from "zod";

const querySchema = z.object({
  cep: z.string().min(8),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const validation = querySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ message: "CEP inválido" }, { status: 400 });
  }

  const cep = normalizeCep(validation.data.cep);
  if (cep.length !== 8) {
    return NextResponse.json({ message: "CEP inválido" }, { status: 400 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ message: "Carrinho vazio" }, { status: 400 });
  }

  const options: { method: string; label: string; price: number; info?: string }[] = [
    { method: "PICKUP", label: "Retirar na loja (grátis)", price: 0 },
  ];

  const local = await isLocalDelivery(cep);
  if (local) {
    options.push({
      method: "LOCAL",
      label: "Entrega local em Itapipoca",
      price: LOCAL_DELIVERY_FEE,
    });
  }

  const shippingItems = cartItems.map((item) => ({
    quantity: item.quantity,
    weightKg: item.product.weightKg,
    heightCm: item.product.heightCm,
    widthCm: item.product.widthCm,
    lengthCm: item.product.lengthCm,
  }));

  const melhorEnvio = await quoteMelhorEnvioFreight(cep, shippingItems);
  if (melhorEnvio) {
    options.push({
      method: "SHIPPING",
      label: `Envio via ${melhorEnvio.carrier}`,
      price: melhorEnvio.price,
      info: melhorEnvio.deliveryDays
        ? `Prazo estimado: ${melhorEnvio.deliveryDays} dia(s) útil(eis)`
        : undefined,
    });
  }

  return NextResponse.json({ options, isLocal: local });
}
