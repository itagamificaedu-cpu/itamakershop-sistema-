import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/products/add-to-cart-button";

export const metadata = {
  title: "Todos os Produtos - ItaMakerShop",
  description: "Impressão 3D e corte a laser sob medida",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { categoryId: category } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Todos os Produtos</h1>

      {products.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group border rounded-lg overflow-hidden">
              <Link href={`/products/${product.id}`} className="block relative">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.images[0] || "/placeholder-product.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    {product.category.name}
                  </div>
                  <h2 className="font-semibold text-lg mb-2 group-hover:underline">
                    {product.name}
                  </h2>
                  <p className="font-medium">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
              <div className="p-4 pt-0">
                <AddToCartButton
                  productId={product.id}
                  disabled={product.inventory <= 0}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
