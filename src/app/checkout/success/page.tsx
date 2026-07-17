import Link from "next/link";
import { getServerSession } from "next-auth";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata = {
  title: "Meu Pedido | ItaMakerShop",
  description: "Status do seu pedido",
};

export const dynamic = "force-dynamic";

export default async function OrderStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;
  const session = await getServerSession(authOptions);

  const order =
    session?.user && order_id
      ? await prisma.order.findFirst({
          where: { id: order_id, userId: session.user.id },
          include: { orderItems: { include: { product: true } } },
        })
      : null;

  if (!order) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
          <p className="mt-4 text-muted-foreground">
            Não encontramos esse pedido na sua conta.
          </p>
          <Link href="/products" className="mt-8 inline-block">
            <Button>Continuar Comprando</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = {
    APPROVED: {
      icon: <CheckCircle className="h-16 w-16 text-green-500" />,
      title: "Pagamento Aprovado!",
      description: "Recebemos seu pagamento e já vamos preparar seu pedido.",
    },
    PENDING: {
      icon: <Clock className="h-16 w-16 text-yellow-500" />,
      title: "Pagamento em Processamento",
      description:
        "Seu pagamento ainda está sendo processado pelo Mercado Pago. Assim que for confirmado, você será notificado.",
    },
    REJECTED: {
      icon: <XCircle className="h-16 w-16 text-red-500" />,
      title: "Pagamento Não Aprovado",
      description: "Houve um problema com o pagamento. Tente novamente.",
    },
    CANCELLED: {
      icon: <XCircle className="h-16 w-16 text-red-500" />,
      title: "Pedido Cancelado",
      description: "Este pedido foi cancelado.",
    },
    REFUNDED: {
      icon: <XCircle className="h-16 w-16 text-red-500" />,
      title: "Pedido Reembolsado",
      description: "Este pedido foi reembolsado.",
    },
  }[order.paymentStatus] ?? {
    icon: <Clock className="h-16 w-16 text-yellow-500" />,
    title: "Status do Pedido",
    description: "",
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
          <div className="flex justify-center">{statusInfo.icon}</div>
          <h1 className="mt-6 text-2xl font-bold md:text-3xl">{statusInfo.title}</h1>
          <p className="mt-4 text-muted-foreground">{statusInfo.description}</p>

          <div className="mt-8 rounded-md bg-background p-6 text-left">
            <div className="mb-4 flex justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Número do Pedido</div>
                <div className="font-medium">{order.id}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Data</div>
                <div className="font-medium">{formatDate(order.createdAt)}</div>
              </div>
            </div>
            <div className="border-t pt-4 space-y-2">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/products">
              <Button variant="outline">Continuar Comprando</Button>
            </Link>
            <Link href="/profile">
              <Button>Ver Meus Pedidos</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
