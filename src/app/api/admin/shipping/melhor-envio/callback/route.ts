import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { exchangeCodeForToken } from "@/lib/melhor-envio-auth";

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const savedState = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("me_oauth_state="))
    ?.split("=")[1];

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${baseUrl}/admin/frete?erro=estado_invalido`);
  }

  const success = await exchangeCodeForToken(code);

  const response = NextResponse.redirect(
    `${baseUrl}/admin/frete?${success ? "conectado=1" : "erro=token"}`
  );
  response.cookies.delete("me_oauth_state");
  return response;
}
