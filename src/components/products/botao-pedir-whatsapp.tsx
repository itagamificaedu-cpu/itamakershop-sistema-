import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { SITE_URL, linkWhatsapp } from "@/lib/contato"

export default function BotaoPedirWhatsapp({
  id,
  nome,
  preco,
  className,
}: {
  id: string
  nome: string
  preco: number
  className?: string
}) {
  const mensagem = `Olá! Quero pedir: ${nome} (${formatPrice(preco)}).\n${SITE_URL}/products/${id}`

  return (
    <a href={linkWhatsapp(mensagem)} target="_blank" rel="noopener noreferrer" className={className}>
      <Button variant="outline" size="lg" className="w-full gap-2">
        <MessageCircle className="h-5 w-5" />
        Pedir pelo WhatsApp
      </Button>
    </a>
  )
}
