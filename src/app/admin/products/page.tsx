import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import ProductRow from "@/components/admin/product-row";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Produtos ({products.length})</h2>
        <Button asChild>
          <Link href="/admin/products/novo">Novo Produto</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="overflow-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Produto</th>
                <th className="px-4 py-3 text-left font-medium">Categoria</th>
                <th className="px-4 py-3 text-left font-medium">Preço</th>
                <th className="px-4 py-3 text-left font-medium">Estoque</th>
                <th className="px-4 py-3 text-left font-medium">Destaque</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    category: product.category.name,
                    price: formatPrice(product.price),
                    inventory: product.inventory,
                    featured: product.featured,
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
