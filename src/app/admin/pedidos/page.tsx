import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/order-status-select";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pedidos ({orders.length})</h2>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">Nenhum pedido ainda.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-medium">#{order.id.slice(-8)}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.user.name || order.user.email} · {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      order.paymentStatus === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Pagamento: {order.paymentStatus}
                  </span>
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </div>
              </div>

              <div className="space-y-1 text-sm border-t pt-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-medium border-t mt-3 pt-3">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
