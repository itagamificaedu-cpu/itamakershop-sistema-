import Link from "next/link"
import SafeImage from "@/components/ui/safe-image"
import AddToCartButton from "@/components/products/add-to-cart-button"
import PriceDisplay from "@/components/products/price-display"
import QuoteButton from "@/components/products/quote-button"

export interface ProdutoCartao {
  id: string
  name: string
  price: number
  images: string[]
  inventory: number
  category: { name: string }
}

export default function ProductCard({ product }: { product: ProdutoCartao }) {
  const sobConsulta = product.price <= 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-secondary">
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary shadow-sm backdrop-blur">
          {product.category.name}
        </span>
        {sobConsulta && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
            Sob medida
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-snug">
          <Link href={`/products/${product.id}`} className="transition-colors hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <PriceDisplay price={product.price} />
        <div className="mt-auto pt-2">
          {sobConsulta ? (
            <QuoteButton productName={product.name} className="block w-full" />
          ) : (
            <AddToCartButton productId={product.id} disabled={product.inventory <= 0} className="w-full" />
          )}
        </div>
      </div>
    </article>
  )
}
