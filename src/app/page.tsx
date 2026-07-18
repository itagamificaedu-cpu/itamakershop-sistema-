import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react"
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
      <section className="relative w-full overflow-hidden bg-background py-20 md:py-28 lg:py-36">
        <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_100%)]" />
        <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[110px]" />

        <div className="container relative px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6 animate-fade-up">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Feito sob encomenda, no Brasil
              </div>

              <div className="space-y-4">
                <h1 className="font-heading text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Impressão 3D e Corte a Laser{" "}
                  <span className="text-primary">sob Medida</span>
                </h1>
                <p className="max-w-[560px] text-lg text-muted-foreground">
                  Produtos personalizados com qualidade profissional. Peça o seu na ItaMakerShop
                  e transforme sua ideia em peça real.
                </p>
              </div>

              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/products">
                  <Button size="lg" className="w-full min-[400px]:w-auto gap-2 shadow-sm">
                    Ver Produtos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href="https://wa.me/5588981681498?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20or%C3%A7amento%20na%20ItaMakerShop."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                    Fazer um Orçamento
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Qualidade garantida
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-primary" />
                  Envio para todo o Brasil
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative h-[280px] w-[280px] md:h-[360px] md:w-[360px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-orange-700 opacity-25 blur-3xl" />
                <div className="relative h-full w-full overflow-hidden rounded-full border border-border shadow-xl">
                  <Image
                    src="/logo.png"
                    alt="ItaMakerShop"
                    fill
                    className="object-cover scale-105"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Categorias
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">
              Explore nossos produtos por categoria
            </p>
          </div>
          <div className="mt-10">
            <CategoryGrid categories={categories} />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-16 md:py-24 bg-secondary/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Produtos em Destaque
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">
              Confira os produtos mais procurados
            </p>
          </div>
          <div className="mt-10">
            <FeaturedProducts products={featuredProducts} />
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/products">
              <Button variant="outline" size="lg" className="gap-2">
                Ver Todos os Produtos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative w-full overflow-hidden py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Fique por Dentro
            </h2>
            <p className="max-w-[600px] md:text-lg opacity-90">
              Assine nossa newsletter e receba novidades da ItaMakerShop
            </p>
            <div className="w-full max-w-sm pt-2">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
