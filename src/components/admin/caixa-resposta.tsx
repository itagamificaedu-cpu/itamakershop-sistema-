"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CaixaResposta({
  contato,
  podeResponder,
  aviso,
}: {
  contato: string
  podeResponder: boolean
  aviso?: string
}) {
  const router = useRouter()
  const [texto, setTexto] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  if (!podeResponder) {
    return <p className="mt-4 text-xs text-muted-foreground">{aviso}</p>
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim() || enviando) return
    setEnviando(true)
    setErro(null)

    const resposta = await fetch("/api/admin/mensagens/responder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contato, texto }),
    })
    const dados = (await resposta.json().catch(() => ({}))) as { erro?: string }
    setEnviando(false)

    if (resposta.ok) {
      setTexto("")
      router.refresh()
    } else {
      setErro(dados.erro ?? "Não foi possível enviar.")
    }
  }

  return (
    <form onSubmit={enviar} className="mt-4 space-y-2 border-t pt-4">
      <textarea
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
        rows={3}
        maxLength={1000}
        placeholder="Escreva sua resposta..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        disabled={enviando}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-red-600">{erro}</span>
        <Button type="submit" size="sm" disabled={enviando || !texto.trim()}>
          {enviando ? "Enviando..." : "Enviar pelo Instagram"}
        </Button>
      </div>
    </form>
  )
}
