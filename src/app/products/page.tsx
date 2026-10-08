import { PackageSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CategorySidebar from "@/components/products/category-sidebar";
import ProductCard from "@/components/products/product-card";
import Link from "next/link";
import { buscarData } from "@/lib/datas-comemorativas";

export const metadata = {
  title: "Todos os Produtos - ItaMakerShop",
  description: "Impressão 3D e corte a laser sob medida",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; data?: string }>;
}) {
  const { category, q, data } = await searchParams;
  const dataComemorativa = buscarData(data);

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(category ? { categoryId: category } : {}),
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        ...(dataComemorativa
          ? {
              OR: dataComemorativa.palavrasChave.map((palavra) => ({
                name: { contains: palavra, mode: "insensitive" as const },
              })),
            }
          : {}),
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
          {dataComemorativa && (
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
              Data comemorativa
            </span>
          )}
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {dataComemorativa ? dataComemorativa.nome : "Todos os Produtos"}
          </h1>
          {dataComemorativa && (
            <p className="mt-2 max-w-2xl text-justify text-muted-foreground hyphens-auto">{dataComemorativa.texto}</p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
            {dataComemorativa && (
              <>
                {" · "}
                <Link href="/products" className="font-medium text-primary hover:underline">
                  Ver todos os produtos
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
      <div className="container flex flex-col gap-8 py-10 md:flex-row md:py-14">
        {!dataComemorativa && <CategorySidebar categories={categories} activeCategory={category} q={q} />}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-24 text-center">
              <PackageSearch className="h-10 w-10 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="text-muted-foreground">Nenhum produto encontrado.</p>
            </div>
          ) : dataComemorativa ? (
            // Em data comemorativa, cada tipo de produção (laser/MDF e 3D) fica em seu próprio bloco
            <div className="space-y-10">
              {Array.from(new Set(products.map((p) => p.category.name))).map((nomeCategoria) => (
                <section key={nomeCategoria}>
                  <h2 className="mb-5 border-b border-border/70 pb-2 font-heading text-xl font-bold">
                    {nomeCategoria}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
                    {products
                      .filter((p) => p.category.name === nomeCategoria)
                      .map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </section>
              ))}
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
