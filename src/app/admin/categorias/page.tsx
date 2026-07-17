import { prisma } from "@/lib/prisma";
import CategoryManager from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Categorias</h2>
      <CategoryManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          productCount: c._count.products,
        }))}
      />
    </div>
  );
}
