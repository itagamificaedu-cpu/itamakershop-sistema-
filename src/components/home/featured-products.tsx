import ProductCard, { type ProdutoCartao } from "@/components/products/product-card"

export default function FeaturedProducts({ products }: { products: ProdutoCartao[] }) {
  if (products.length === 0) {
    return <p className="text-center text-muted-foreground">Nenhum produto em destaque no momento.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
