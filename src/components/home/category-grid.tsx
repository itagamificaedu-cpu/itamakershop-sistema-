import Link from "next/link"
import SafeImage from "@/components/ui/safe-image"

interface CategoryGridProps {
  categories: {
    id: string
    name: string
    description: string | null
    capa: string | null
    total: number
  }[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return <p className="text-center text-muted-foreground">Nenhuma categoria cadastrada ainda.</p>
  }

  const colunas = categories.length === 1 ? "sm:grid-cols-1" : categories.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"

  return (
    <div className={`mx-auto grid max-w-5xl grid-cols-1 gap-4 md:gap-6 ${colunas}`}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className="group relative block overflow-hidden rounded-2xl border border-border/70 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative aspect-[16/10] w-full bg-secondary">
            <SafeImage
              src={category.capa}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-5 text-white">
              <h3 className="font-heading text-2xl font-bold">{category.name}</h3>
              <p className="mt-1 text-sm text-white/80">
                {category.total} {category.total === 1 ? "produto" : "produtos"}
                {category.description ? ` · ${category.description}` : ""}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
