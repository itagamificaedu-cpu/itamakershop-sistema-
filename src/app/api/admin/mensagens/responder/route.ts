import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { enviarTextoInstagram, JANELA_RESPOSTA_HORAS } from "@/lib/meta-envio";

const esquemaResposta = z.object({
  contato: z.string().min(1),
  texto: z.string().trim().min(1, "Escreva a mensagem").max(1000, "Máximo de 1000 caracteres"),
});

export async function POST(req: Request) {
  const sessao = await requireAdminSession();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  const corpo = esquemaResposta.safeParse(await req.json().catch(() => null));
  if (!corpo.success) {
    return NextResponse.json({ erro: corpo.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }
  const { contato, texto } = corpo.data;

  // Só responde quem já escreveu para a loja pelo Instagram, e dentro da janela da Meta.
  const ultimaEntrada = await prisma.mensagemSocial.findFirst({
    where: { canal: "instagram", direcao: "entrada", contato },
    orderBy: { createdAt: "desc" },
  });
  if (!ultimaEntrada) {
    return NextResponse.json({ erro: "Esse contato nunca escreveu para a loja." }, { status: 400 });
  }
  const limite = Date.now() - JANELA_RESPOSTA_HORAS * 60 * 60 * 1000;
  if (ultimaEntrada.createdAt.getTime() < limite) {
    return NextResponse.json(
      { erro: "Já passaram mais de 24 horas desde a última mensagem do cliente. A Meta não permite responder." },
      { status: 400 }
    );
  }

  const envio = await enviarTextoInstagram(contato, texto);
  if (!envio.ok) {
    return NextResponse.json({ erro: envio.erro }, { status: 502 });
  }

  // O mesmo aviso pode voltar da Meta como "eco"; o idExterno único evita duplicar.
  await prisma.mensagemSocial.createMany({
    data: [
      {
        canal: "instagram",
        direcao: "saida",
        contato,
        texto,
        idExterno: envio.idExterno,
      },
    ],
    skipDuplicates: true,
  });

  return NextResponse.json({ ok: true });
}
