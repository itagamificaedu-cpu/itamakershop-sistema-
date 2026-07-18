import Link from "next/link"
import SafeImage from "@/components/ui/safe-image"

interface CategoryGridProps {
  categories: {
    id: string
    name: string
    description: string | null
    image: string | null
  }[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Nenhuma categoria cadastrada ainda.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className="group relative overflow-hidden rounded-xl border border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="aspect-[4/3] w-full">
            <SafeImage
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/0" />
            <div className="absolute bottom-0 left-0 w-full p-5 text-white">
              <h3 className="font-heading text-xl font-bold">{category.name}</h3>
              {category.description && (
                <p className="mt-0.5 text-sm text-white/75 line-clamp-1">{category.description}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
