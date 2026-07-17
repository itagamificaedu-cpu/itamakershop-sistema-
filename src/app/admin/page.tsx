import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata = {
  title: "Admin | ItaMakerShop",
  description: "Gerencie sua loja, produtos, pedidos e mais",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [productCount, categoryCount, orderCount, approvedOrders, recentOrders, lowStock] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.findMany({ where: { paymentStatus: "APPROVED" }, select: { total: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.product.findMany({
        where: { inventory: { lte: 5 } },
        orderBy: { inventory: "asc" },
        take: 5,
      }),
    ]);

  const revenue = approvedOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Faturamento (pedidos aprovados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(revenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pedidos Recentes</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/pedidos">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum pedido ainda.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between text-sm border-b pb-2">
                    <div>
                      <div className="font-medium">{order.user.name || order.user.email}</div>
                      <div className="text-muted-foreground">{formatDate(order.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatPrice(order.total)}</div>
                      <div className="text-muted-foreground">{order.paymentStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Estoque Baixo</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">Ver produtos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum produto com estoque baixo.</p>
            ) : (
              <div className="space-y-3">
                {lowStock.map((product) => (
                  <div key={product.id} className="flex justify-between text-sm border-b pb-2">
                    <span>{product.name}</span>
                    <span className={product.inventory <= 2 ? "text-red-500 font-medium" : "text-yellow-500 font-medium"}>
                      {product.inventory} un.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
