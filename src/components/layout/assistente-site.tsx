"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Bot, MessageCircle, Send, X } from "lucide-react"

type Mensagem = {
  role: "user" | "assistant"
  content: string
  whatsapp?: string
}

const BOAS_VINDAS: Mensagem = {
  role: "assistant",
  content:
    "Oi! Eu sou o assistente da ItaMakerShop. Posso tirar dúvidas sobre produtos, preços, entrega e orçamento. O que você procura?",
}

const SUGESTOES = [
  "Quais produtos vocês têm?",
  "Como funciona a entrega?",
  "Quero um orçamento personalizado",
]

export default function AssistenteSite() {
  const caminho = usePathname()
  const [aberto, setAberto] = useState(false)
  const [mensagens, setMensagens] = useState<Mensagem[]>([BOAS_VINDAS])
  const [texto, setTexto] = useState("")
  const [carregando, setCarregando] = useState(false)
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [mensagens, carregando, aberto])

  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false)
    }
    window.addEventListener("keydown", aoTeclar)
    return () => window.removeEventListener("keydown", aoTeclar)
  }, [aberto])

  if (caminho?.startsWith("/admin")) return null

  async function enviar(conteudo: string) {
    const limpo = conteudo.trim().slice(0, 600)
    if (!limpo || carregando) return

    const novas: Mensagem[] = [...mensagens, { role: "user", content: limpo }]
    setMensagens(novas)
    setTexto("")
    setCarregando(true)

    try {
      // A conversa enviada começa na primeira mensagem do cliente e guarda as últimas 12.
      const historico = novas
        .filter((m, i) => !(i === 0 && m === BOAS_VINDAS))
        .slice(-12)
        .map(({ role, content }) => ({ role, content }))
      while (historico.length && historico[0].role !== "user") historico.shift()

      const resposta = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens: historico }),
      })
      const dados = (await resposta.json()) as { resposta?: string; whatsapp?: string; erro?: string }

      setMensagens((atual) => [
        ...atual,
        {
          role: "assistant",
          content: dados.resposta ?? "Não consegui responder agora. Chame a gente no WhatsApp.",
          whatsapp: dados.whatsapp,
        },
      ])
    } catch {
      setMensagens((atual) => [
        ...atual,
        { role: "assistant", content: "Estou sem conexão agora. Tente de novo em instantes ou chame no WhatsApp." },
      ])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      {aberto && (
        <section
          role="dialog"
          aria-label="Assistente da ItaMakerShop"
          className="fixed bottom-36 right-4 z-50 flex max-h-[70vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:right-5 sm:w-96"
        >
          <header className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold leading-tight">Assistente ItaMakerShop</p>
                <p className="text-xs opacity-85">Respostas automáticas na hora</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar o chat"
              className="rounded-full p-1 hover:bg-white/15"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            {mensagens.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className="max-w-[85%] space-y-2">
                  <div
                    className={
                      m.role === "user"
                        ? "whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground"
                        : "whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-foreground"
                    }
                  >
                    {m.content}
                  </div>
                  {m.whatsapp && (
                    <a
                      href={m.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white shadow"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Continuar no WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}

            {carregando && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-muted-foreground">Digitando...</div>
              </div>
            )}

            {mensagens.length === 1 && !carregando && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGESTOES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => enviar(s)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={fimRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              enviar(texto)
            }}
            className="flex items-center gap-2 border-t border-border bg-background px-3 py-3"
          >
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={600}
              placeholder="Digite sua dúvida..."
              aria-label="Digite sua mensagem"
              className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={carregando || !texto.trim()}
              aria-label="Enviar mensagem"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-label={aberto ? "Fechar o assistente" : "Abrir o assistente da loja"}
        className="fixed bottom-20 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        <Bot className="h-6 w-6" />
        <span className="hidden sm:inline">Tire suas dúvidas</span>
      </button>
    </>
  )
}
