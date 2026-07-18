import Link from "next/link"
import SafeImage from "@/components/ui/safe-image"
import { formatPrice } from "@/lib/utils"
import AddToCartButton from "@/components/products/add-to-cart-button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface FeaturedProduct {
  id: string
  name: string
  price: number
  images: string[]
  inventory: number
  category: { name: string }
}

export default function FeaturedProducts({ products }: { products: FeaturedProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Nenhum produto em destaque no momento.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group overflow-hidden border-border/70 transition-shadow hover:shadow-lg"
        >
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-square overflow-hidden bg-secondary">
              <SafeImage
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
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
  )
}
