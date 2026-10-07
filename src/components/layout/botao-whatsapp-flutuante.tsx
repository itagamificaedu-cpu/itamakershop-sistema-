"use client"

import { usePathname } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { linkWhatsapp } from "@/lib/contato"

export default function BotaoWhatsappFlutuante() {
  const caminho = usePathname()

  if (caminho?.startsWith("/admin")) return null

  return (
    <a
      href={linkWhatsapp("Olá! Vim pelo site da ItaMakerShop e gostaria de ajuda.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a ItaMakerShop no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline">Fale conosco</span>
    </a>
  )
}
