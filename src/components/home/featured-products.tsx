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
        <Card key={product.id} className="overflow-hidden group">
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-square">
              <SafeImage
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
          <CardHeader className="p-4">
            <div className="text-sm text-muted-foreground">
              {product.category.name}
            </div>
            <CardTitle className="text-lg">
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="font-medium text-lg">
              {formatPrice(product.price)}
            </div>
          </CardContent>
          <CardFooter className="p-4">
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
