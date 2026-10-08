import { NextResponse } from "next/server"
import { z } from "zod"
import { linkWhatsapp } from "@/lib/contato"
import { MARCADOR_WHATSAPP, MODELO_ASSISTENTE, montarPromptSistema } from "@/lib/assistente"

export const dynamic = "force-dynamic"

const corpoSchema = z.object({
  mensagens: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(600),
      })
    )
    .min(1)
    .max(14),
})

// Limites simples em memória para proteger o custo: por visitante e por dia.
const JANELA_MS = 10 * 60 * 1000
const MAX_POR_JANELA = 20
const MAX_POR_DIA = 800
const porIp = new Map<string, number[]>()
let contadorDia = { dia: "", total: 0 }

function dentroDoLimite(ip: string) {
  const agora = Date.now()
  const hoje = new Date(agora).toISOString().slice(0, 10)
  if (contadorDia.dia !== hoje) contadorDia = { dia: hoje, total: 0 }
  if (contadorDia.total >= MAX_POR_DIA) return false

  const recentes = (porIp.get(ip) ?? []).filter((t) => agora - t < JANELA_MS)
  if (recentes.length >= MAX_POR_JANELA) return false
  recentes.push(agora)
  porIp.set(ip, recentes)
  contadorDia.total += 1

  if (porIp.size > 5000) {
    for (const [chave, tempos] of porIp) {
      if (tempos.every((t) => agora - t >= JANELA_MS)) porIp.delete(chave)
    }
  }
  return true
}

function respostaIndisponivel(motivo: number) {
  return NextResponse.json(
    {
      resposta:
        "Não consegui responder agora. Pode falar direto com a gente pelo WhatsApp que atendemos rapidinho.",
      whatsapp: linkWhatsapp("Olá! Vim pelo site da ItaMakerShop e gostaria de ajuda."),
    },
    { status: motivo }
  )
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconhecido"

  let corpo: z.infer<typeof corpoSchema>
  try {
    corpo = corpoSchema.parse(await request.json())
  } catch {
    return NextResponse.json({ erro: "Mensagem inválida." }, { status: 400 })
  }

  if (corpo.mensagens[corpo.mensagens.length - 1].role !== "user") {
    return NextResponse.json({ erro: "Mensagem inválida." }, { status: 400 })
  }

  if (!dentroDoLimite(ip)) {
    return NextResponse.json(
      {
        resposta:
          "Recebi muitas mensagens em pouco tempo. Para continuar agora, chame a gente no WhatsApp.",
        whatsapp: linkWhatsapp("Olá! Vim pelo site da ItaMakerShop e gostaria de ajuda."),
      },
      { status: 429 }
    )
  }

  const chave = process.env.ANTHROPIC_API_KEY
  if (!chave) return respostaIndisponivel(503)

  try {
    const sistema = await montarPromptSistema()
    const resposta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": chave,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODELO_ASSISTENTE,
        max_tokens: 400,
        system: sistema,
        messages: corpo.mensagens,
      }),
      signal: AbortSignal.timeout(20000),
    })

    if (!resposta.ok) {
      console.error("Assistente: erro da API", resposta.status)
      return respostaIndisponivel(502)
    }

    const dados = (await resposta.json()) as { content?: { type: string; text?: string }[] }
    let texto = (dados.content ?? [])
      .filter((bloco) => bloco.type === "text")
      .map((bloco) => bloco.text ?? "")
      .join("\n")
      .trim()

    let linkZap: string | undefined
    const inicio = texto.indexOf(MARCADOR_WHATSAPP)
    if (inicio !== -1) {
      const resto = texto.slice(inicio + MARCADOR_WHATSAPP.length)
      const resumo = resto.split("]]")[0].trim().slice(0, 300)
      texto = texto.slice(0, inicio).trim()
      linkZap = linkWhatsapp(
        resumo ? `Olá! Vim pelo site da ItaMakerShop. ${resumo}` : "Olá! Vim pelo site da ItaMakerShop e gostaria de ajuda."
      )
    }

    if (!texto) return respostaIndisponivel(502)
    return NextResponse.json({ resposta: texto, whatsapp: linkZap })
  } catch (erro) {
    console.error("Assistente: falha", erro instanceof Error ? erro.message : erro)
    return respostaIndisponivel(502)
  }
}
