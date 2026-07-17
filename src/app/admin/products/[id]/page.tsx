import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Editar Produto</h2>
      <ProductForm
        categories={categories}
        productId={product.id}
        initialData={{
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          categoryId: product.categoryId,
          featured: product.featured,
          inventory: product.inventory,
        }}
      />
    </div>
  );
}
