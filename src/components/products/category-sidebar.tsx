import Link from "next/link";
import { cn } from "@/lib/utils";

type CategoryWithCount = {
  id: string;
  name: string;
  _count: { products: number };
};

export default function CategorySidebar({
  categories,
  activeCategory,
  q,
}: {
  categories: CategoryWithCount[];
  activeCategory?: string;
  q?: string;
}) {
  const buildHref = (categoryId?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoryId) params.set("category", categoryId);
    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="sticky top-24">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
          Filtrar por
        </h2>

        <div className="mt-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Categorias
          </h3>
          <ul className="mt-3 flex flex-col gap-1 border-t border-border/70 pt-3">
            <li>
              <Link
                href={buildHref(undefined)}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary hover:text-primary",
                  !activeCategory
                    ? "font-semibold text-primary"
                    : "text-foreground/80"
                )}
              >
                Todas
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={buildHref(category.id)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary hover:text-primary",
                    activeCategory === category.id
                      ? "font-semibold text-primary"
                      : "text-foreground/80"
                  )}
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({category._count.products})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
