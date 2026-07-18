import Link from "next/link"
import { Printer, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeaturedProducts from "@/components/home/featured-products"
import CategoryGrid from "@/components/home/category-grid"
import NewsletterSignup from "@/components/home/newsletter-signup"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ take: 6 }),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Impressão 3D e Corte a Laser sob Medida
                </h1>
                <p className="max-w-[600px] text-gray-300 md:text-xl">
                  Produtos personalizados com qualidade profissional. Peça o seu na ItaMakerShop.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                    Ver Produtos
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[450px] lg:w-[450px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur-3xl opacity-30" />
                <div className="relative bg-gray-900 rounded-full overflow-hidden h-full w-full border-2 border-gray-800">
                  <div className="h-full flex items-center justify-center gap-6">
                    <Printer className="h-20 w-20 md:h-28 md:w-28 text-white/90" strokeWidth={1.5} />
                    <Zap className="h-16 w-16 md:h-24 md:w-24 text-white/90" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Categorias
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore nossos produtos por categoria
              </p>
            </div>
          </div>
          <div className="mt-8">
            <CategoryGrid categories={categories} />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Produtos em Destaque
              </h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Confira os produtos mais procurados
              </p>
            </div>
          </div>
          <div className="mt-8">
            <FeaturedProducts products={featuredProducts} />
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/products">
              <Button variant="outline" size="lg">
                Ver Todos os Produtos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Fique por Dentro
              </h2>
              <p className="max-w-[700px] md:text-xl/relaxed">
                Assine nossa newsletter e receba novidades da ItaMakerShop
              </p>
            </div>
            <div className="w-full max-w-sm">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
