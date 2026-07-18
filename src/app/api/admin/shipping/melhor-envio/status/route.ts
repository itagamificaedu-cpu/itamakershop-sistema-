import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { isMelhorEnvioConnected, disconnectMelhorEnvio } from "@/lib/melhor-envio-auth";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const connected = await isMelhorEnvioConnected();
  return NextResponse.json({ connected });
}

export async function DELETE() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  await disconnectMelhorEnvio();
  return NextResponse.json({ message: "Desconectado" });
}
