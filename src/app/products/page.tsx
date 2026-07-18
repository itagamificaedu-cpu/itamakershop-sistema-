import Link from "next/link";
import { PackageSearch } from "lucide-react";
import SafeImage from "@/components/ui/safe-image";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/products/add-to-cart-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    <>
      <div className="border-b border-border/70 bg-secondary/30">
        <div className="container py-10 md:py-14">
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Todos os Produtos
          </h1>
          <p className="mt-2 text-muted-foreground">
            {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>
      </div>
      <div className="container py-10 md:py-14">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-24 text-center">
          <PackageSearch className="h-10 w-10 text-muted-foreground/60" strokeWidth={1.5} />
          <p className="text-muted-foreground">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-border/70 transition-shadow hover:shadow-lg">
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <SafeImage
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
              <CardHeader className="p-4 pb-0">
                <div className="text-xs font-medium uppercase tracking-wide text-primary">
                  {product.category.name}
                </div>
                <CardTitle className="text-base font-semibold">
                  <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                    {product.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="font-heading text-lg font-bold">
                  {formatPrice(product.price)}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <AddToCartButton
                  productId={product.id}
                  disabled={product.inventory <= 0}
                  className="w-full"
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
