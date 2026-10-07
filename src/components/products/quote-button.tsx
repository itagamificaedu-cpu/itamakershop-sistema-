import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { linkWhatsapp } from "@/lib/contato"

export default function QuoteButton({
  productName,
  className,
  size = "sm",
}: {
  productName: string
  className?: string
  size?: "default" | "sm" | "lg"
}) {
  return (
    <a
      href={linkWhatsapp(`Olá! Gostaria de um orçamento: ${productName}`)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <Button size={size} className="w-full gap-2">
        <MessageCircle className="h-4 w-4" />
        Pedir orçamento
      </Button>
    </a>
  )
}
