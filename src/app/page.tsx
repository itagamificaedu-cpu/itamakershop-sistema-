import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CreditCard, MessageCircle, Package, Percent, Ruler, ShieldCheck, Sparkles, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import SafeImage from "@/components/ui/safe-image"
import FeaturedProducts from "@/components/home/featured-products"
import CategoryGrid from "@/components/home/category-grid"
import DatasComemorativas from "@/components/home/datas-comemorativas"
import NewsletterSignup from "@/components/home/newsletter-signup"
import { prisma } from "@/lib/prisma"
import { linkWhatsapp } from "@/lib/contato"
import { PIX_DISCOUNT_LABEL } from "@/lib/pricing"
import { datasAtivas } from "@/lib/datas-comemorativas"

export const dynamic = "force-dynamic"

const DIFERENCIAIS = [
  { icone: Percent, titulo: `Pix com ${PIX_DISCOUNT_LABEL} off`, texto: "Desconto no pagamento à vista" },
  { icone: CreditCard, titulo: "Até 3x sem juros", texto: "Pelo Mercado Pago" },
  { icone: Store, titulo: "Retirada grátis", texto: "Na loja, em Itapipoca" },
  { icone: Sparkles, titulo: "Feito sob medida", texto: "Seu nome, sua ideia, sua cor" },
]

const PASSOS = [
  {
    icone: MessageCircle,
    titulo: "Escolha ou conte sua ideia",
    texto: "Veja os produtos do site ou mande a sua ideia pelo WhatsApp ou direct.",
  },
  {
    icone: Ruler,
    titulo: "Receba o orçamento",
    texto: "A gente combina modelo, nome, cor, tamanho e quantidade, e passa o valor.",
  },
  {
    icone: Package,
    titulo: "Produzimos e entregamos",
    texto: "Impressão 3D ou corte a laser, com retirada em Itapipoca ou envio pelos Correios.",
  },
]

export default async function Home() {
  const datas = datasAtivas().slice(0, 2)

  const [destaques, recentes, categoriasBrutas] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
    prisma.category.findMany({
      take: 6,
      include: {
        _count: { select: { products: true } },
        products: {
          where: { NOT: { images: { isEmpty: true } } },
          select: { images: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
  ])

  // Completa os destaques com os produtos mais novos, para a vitrine nunca ficar vazia.
  const jaTem = new Set(destaques.map((p) => p.id))
  const vitrine = [...destaques, ...recentes.filter((p) => !jaTem.has(p.id) && p.images.length > 0)].slice(0, 8)
  const fotosHero = vitrine.filter((p) => p.images.length > 0).slice(0, 4)

  const categorias = categoriasBrutas.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    capa: c.image ?? c.products[0]?.images[0] ?? null,
    total: c._count.products,
  }))

  return (
    <div className="flex min-h-screen flex-col">
      {/* Datas comemorativas */}
      <DatasComemorativas datas={datas} />

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-accent/60 py-14 md:py-20 lg:py-24">
        <div className="container relative px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6 animate-fade-up">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Feito sob encomenda em Itapipoca, Ceará
              </div>

              <div className="space-y-4">
                <h1 className="font-heading text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Presentes e peças <span className="text-primary">feitos sob medida</span>
                </h1>
                <p className="max-w-[560px] text-justify text-lg text-muted-foreground hyphens-auto">
                  Impressão 3D e corte a laser com o seu nome, a sua ideia e a sua cor. Chaveiros, lembranças,
                  brinquedos e peças para escola e empresa.
                </p>
              </div>

              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/products">
                  <Button size="lg" className="w-full gap-2 shadow-md min-[400px]:w-auto">
                    Ver Produtos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href={linkWhatsapp("Olá! Gostaria de fazer um orçamento na ItaMakerShop.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="w-full gap-2 min-[400px]:w-auto">
                    <MessageCircle className="h-4 w-4" />
                    Fazer um Orçamento
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Qualidade garantida
                </span>
                <span className="flex items-center gap-1.5">
                  <Store className="h-4 w-4 text-primary" />
                  Retirada grátis em Itapipoca
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              {fotosHero.length >= 2 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {fotosHero.map((produto, i) => (
                    <Link
                      key={produto.id}
                      href={`/products/${produto.id}`}
                      aria-label={produto.name}
                      className={`group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 bg-secondary shadow-lg ${
                        i % 2 === 1 ? "mt-8" : ""
                      }`}
                    >
                      <SafeImage
                        src={produto.images[0]}
                        alt={produto.name}
                        fill
                        priority={i < 2}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="relative mx-auto h-[280px] w-[280px] overflow-hidden rounded-full border border-border shadow-xl md:h-[360px] md:w-[360px]">
                  <Image src="/logo.png" alt="ItaMakerShop" fill className="object-cover scale-105" priority />
                </div>
              )}
              <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-background px-4 py-2 text-sm font-semibold shadow-xl ring-1 ring-border">
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Orçamento rápido pelo WhatsApp
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="w-full border-y border-border/70 bg-background py-8">
        <div className="container grid grid-cols-2 gap-6 px-4 md:px-6 lg:grid-cols-4">
          {DIFERENCIAIS.map(({ icone: Icone, titulo, texto }) => (
            <div key={titulo} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{titulo}</p>
                <p className="text-xs text-muted-foreground">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="w-full bg-background py-14 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-3 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">Escolha por categoria</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">
              Impressão 3D e corte a laser, tudo feito aqui em Itapipoca
            </p>
          </div>
          <div className="mt-10">
            <CategoryGrid categories={categorias} />
          </div>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="w-full bg-secondary/50 py-14 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-3 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">Produtos em destaque</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">
              Os mais pedidos e as novidades da loja
            </p>
          </div>
          <div className="mt-10">
            <FeaturedProducts products={vitrine} />
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/products">
              <Button variant="outline" size="lg" className="gap-2">
                Ver todos os produtos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Como pedir */}
      <section className="w-full bg-background py-14 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-3 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">Como pedir uma peça sob medida</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">Simples e sem complicação</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
            {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
              <div key={titulo} className="relative rounded-2xl border border-border/70 bg-card p-6 text-center shadow-sm">
                <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="mx-auto mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icone className="h-7 w-7" />
                </span>
                <h3 className="font-heading text-lg font-bold">{titulo}</h3>
                <p className="mt-2 text-justify text-sm text-muted-foreground hyphens-auto">{texto}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <a
              href={linkWhatsapp("Olá! Quero pedir uma peça sob medida na ItaMakerShop.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2 shadow-md">
                <MessageCircle className="h-4 w-4" />
                Começar meu pedido no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative w-full overflow-hidden bg-primary py-14 text-primary-foreground md:py-20">
        <div className="container relative px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">Fique por dentro</h2>
            <p className="max-w-[600px] opacity-90 md:text-lg">
              Receba novidades e ofertas da ItaMakerShop no seu e-mail
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
