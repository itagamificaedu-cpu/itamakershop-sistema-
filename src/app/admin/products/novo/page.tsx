import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Novo Produto</h2>
      {categories.length === 0 ? (
        <p className="text-muted-foreground">
          Cadastre uma categoria antes de criar produtos.
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
