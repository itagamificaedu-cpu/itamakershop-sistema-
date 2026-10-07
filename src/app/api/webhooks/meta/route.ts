import crypto from "crypto";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Receptor dos avisos da Meta (WhatsApp Business e Instagram).
// Só funciona com META_VERIFY_TOKEN e META_APP_SECRET configurados; sem eles, recusa tudo.

type NovaMensagem = {
  canal: string;
  direcao: string;
  contato: string;
  texto: string | null;
  idExterno: string | null;
  bruto: object;
};

// Verificação inicial: a Meta chama este endereço uma vez ao cadastrar o webhook.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const esperado = process.env.META_VERIFY_TOKEN;
  const modo = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const desafio = searchParams.get("hub.challenge");

  if (esperado && modo === "subscribe" && token === esperado && desafio) {
    return new NextResponse(desafio, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

function assinaturaValida(corpoBruto: string, assinatura: string, segredo: string) {
  const esperada =
    "sha256=" + crypto.createHmac("sha256", segredo).update(corpoBruto).digest("hex");
  const a = Buffer.from(assinatura);
  const b = Buffer.from(esperada);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

type MensagemWhatsapp = { id?: string; from?: string; text?: { body?: string } };
type EventoInstagram = {
  sender?: { id?: string };
  recipient?: { id?: string };
  message?: { mid?: string; text?: string; is_echo?: boolean };
};
type CorpoMeta = {
  object?: string;
  entry?: {
    changes?: { value?: { messages?: MensagemWhatsapp[] } }[];
    messaging?: EventoInstagram[];
  }[];
};

function extrairMensagens(corpo: CorpoMeta): NovaMensagem[] {
  const mensagens: NovaMensagem[] = [];

  if (corpo?.object === "whatsapp_business_account") {
    for (const entrada of corpo.entry ?? []) {
      for (const mudanca of entrada.changes ?? []) {
        for (const m of mudanca.value?.messages ?? []) {
          mensagens.push({
            canal: "whatsapp",
            direcao: "entrada",
            contato: String(m.from ?? ""),
            texto: m.text?.body ?? null,
            idExterno: m.id ?? null,
            bruto: m,
          });
        }
      }
    }
  }

  if (corpo?.object === "instagram") {
    for (const entrada of corpo.entry ?? []) {
      for (const evento of entrada.messaging ?? []) {
        if (!evento.message) continue;
        const eco = Boolean(evento.message.is_echo);
        mensagens.push({
          canal: "instagram",
          direcao: eco ? "saida" : "entrada",
          contato: String(eco ? evento.recipient?.id : evento.sender?.id),
          texto: evento.message.text ?? null,
          idExterno: evento.message.mid ?? null,
          bruto: evento,
        });
      }
    }
  }

  return mensagens;
}

export async function POST(req: Request) {
  const segredo = process.env.META_APP_SECRET;
  if (!segredo) {
    return new NextResponse("Webhook não configurado", { status: 503 });
  }

  const corpoBruto = await req.text();
  const assinatura = req.headers.get("x-hub-signature-256") ?? "";

  if (!assinaturaValida(corpoBruto, assinatura, segredo)) {
    return new NextResponse("Assinatura inválida", { status: 403 });
  }

  let corpo: CorpoMeta;
  try {
    corpo = JSON.parse(corpoBruto) as CorpoMeta;
  } catch {
    return new NextResponse("JSON inválido", { status: 400 });
  }

  const mensagens = extrairMensagens(corpo);
  if (mensagens.length > 0) {
    await prisma.mensagemSocial.createMany({
      data: mensagens.map((m) => ({ ...m, bruto: m.bruto as Prisma.InputJsonObject })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json({ ok: true });
}
