import Link from "next/link"
import { ArrowRight, CalendarHeart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard, { type ProdutoCartao } from "@/components/products/product-card"
import { linkWhatsapp } from "@/lib/contato"
import { textoContagem, type DataAtiva } from "@/lib/datas-comemorativas"

interface Props {
  datas: DataAtiva[]
  produtos: ProdutoCartao[]
}

export default function DatasComemorativas({ datas, produtos }: Props) {
  if (datas.length === 0) return null

  return (
    <section className="w-full bg-primary py-10 text-primary-foreground md:py-14">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-3 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <CalendarHeart className="h-3.5 w-3.5" />
            Datas comemorativas
          </span>
          <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">Encomende com antecedência</h2>
          <p className="max-w-[620px] text-primary-foreground/85 md:text-base">
            Cada peça é feita sob encomenda. Garanta o seu presente antes que a data chegue.
          </p>
        </div>

        <div className={`mx-auto mt-8 grid max-w-5xl gap-5 ${datas.length > 1 ? "md:grid-cols-2" : ""}`}>
          {datas.slice(0, 2).map((data) => (
            <div key={data.id} className="flex flex-col rounded-2xl bg-white p-6 text-slate-900 shadow-xl md:p-8">
              <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {textoContagem(data.diasRestantes)}
              </span>
              <h3 className="mt-4 font-heading text-2xl font-bold md:text-3xl">{data.nome}</h3>
              <p className="mt-1 font-medium text-primary">{data.chamada}</p>
              <p className="mt-3 flex-1 text-justify text-sm text-slate-600 hyphens-auto">{data.texto}</p>
              <div className="mt-6 flex flex-col gap-3 min-[400px]:flex-row">
                <a href={linkWhatsapp(data.mensagemWhatsapp)} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full gap-2 min-[400px]:w-auto">
                    <MessageCircle className="h-4 w-4" />
                    Encomendar agora
                  </Button>
                </a>
                <Link href={`/products?data=${data.id}`}>
                  <Button variant="outline" className="w-full gap-2 min-[400px]:w-auto">
                    Ver produtos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {produtos.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-5 text-center font-heading text-xl font-bold">Ideias de presente</h3>
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {produtos.slice(0, 4).map((produto) => (
                <ProductCard key={produto.id} product={produto} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
