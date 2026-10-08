import { PackageSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CategorySidebar from "@/components/products/category-sidebar";
import ProductCard from "@/components/products/product-card";

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

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(category ? { categoryId: category } : {}),
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    }),
  ]);

  return (
    <>
      <div className="border-b border-border/70 bg-secondary/40">
        <div className="container py-10 md:py-14">
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Todos os Produtos
          </h1>
          <p className="mt-2 text-muted-foreground">
            {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>
      </div>
      <div className="container flex flex-col gap-8 py-10 md:flex-row md:py-14">
        <CategorySidebar categories={categories} activeCategory={category} q={q} />
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-24 text-center">
              <PackageSearch className="h-10 w-10 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="text-muted-foreground">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
