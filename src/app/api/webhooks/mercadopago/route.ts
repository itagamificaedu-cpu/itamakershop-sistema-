import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { getMpClient } from "@/lib/mercadopago";

// Mapeia status de pagamento do Mercado Pago para o pedido
function mapStatus(mpStatus: string) {
  switch (mpStatus) {
    case "approved":
      return { paymentStatus: "APPROVED", status: "PROCESSING" };
    case "rejected":
      return { paymentStatus: "REJECTED", status: "CANCELLED" };
    case "cancelled":
      return { paymentStatus: "CANCELLED", status: "CANCELLED" };
    case "refunded":
    case "charged_back":
      return { paymentStatus: "REFUNDED", status: "CANCELLED" };
    case "in_process":
    case "pending":
    default:
      return { paymentStatus: "PENDING", status: "PENDING" };
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    const type = url.searchParams.get("type") || body.type;
    const paymentId = url.searchParams.get("data.id") || body.data?.id;

    if (type !== "payment" || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const payment = new Payment(getMpClient());
    const paymentInfo = await payment.get({ id: paymentId });

    const orderId = paymentInfo.external_reference;
    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ received: true });
    }

    const { paymentStatus, status } = mapStatus(paymentInfo.status || "pending");
    const alreadyApproved = order.paymentStatus === "APPROVED";

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        status,
        mpPaymentId: String(paymentInfo.id),
      },
    });

    // Decrementa estoque só na primeira confirmação de aprovação (evita duplicar em notificações repetidas do MP)
    if (paymentStatus === "APPROVED" && !alreadyApproved) {
      const orderItems = await prisma.orderItem.findMany({ where: { orderId } });
      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: item.quantity } },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook do Mercado Pago:", error);
    return NextResponse.json({ received: true });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
