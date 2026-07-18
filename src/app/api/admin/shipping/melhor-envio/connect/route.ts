import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getMelhorEnvioAuthorizeUrl } from "@/lib/melhor-envio-auth";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const state = crypto.randomUUID();
  const url = getMelhorEnvioAuthorizeUrl(state);

  if (!url) {
    return NextResponse.json(
      { message: "MELHOR_ENVIO_CLIENT_ID não configurado no servidor" },
      { status: 500 }
    );
  }

  const response = NextResponse.redirect(url);
  response.cookies.set("me_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
