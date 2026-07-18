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
          className="group relative overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg"
        >
          <div className="aspect-square w-full">
            <SafeImage
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/0" />
            <div className="absolute bottom-0 left-0 w-full p-4 text-white">
              <h3 className="text-xl font-bold">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-200">{category.description}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
