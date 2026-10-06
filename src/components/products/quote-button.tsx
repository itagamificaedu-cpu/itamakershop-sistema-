import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function QuoteButton({
  productName,
  className,
  size = "sm",
}: {
  productName: string
  className?: string
  size?: "default" | "sm" | "lg"
}) {
  const text = encodeURIComponent(`Olá! Gostaria de um orçamento: ${productName}`)

  return (
    <a
      href={`https://wa.me/5588981681498?text=${text}`}
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
