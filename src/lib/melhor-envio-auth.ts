import { prisma } from "@/lib/prisma";

const TOKEN_ID = "singleton";
const OAUTH_BASE = "https://melhorenvio.com.br/oauth";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

function getRedirectUri() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${baseUrl}/api/admin/shipping/melhor-envio/callback`;
}

export function getMelhorEnvioAuthorizeUrl(state: string) {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  if (!clientId) return null;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "shipping-calculate",
    state,
  });

  return `${OAUTH_BASE}/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<boolean> {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  if (!clientId || !clientSecret) return false;

  const res = await fetch(`${OAUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getRedirectUri(),
      code,
    }),
  });

  if (!res.ok) return false;

  const data: TokenResponse = await res.json();
  await saveToken(data);
  return true;
}

async function refreshToken(currentRefreshToken: string): Promise<boolean> {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  if (!clientId || !clientSecret) return false;

  const res = await fetch(`${OAUTH_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: currentRefreshToken,
    }),
  });

  if (!res.ok) return false;

  const data: TokenResponse = await res.json();
  await saveToken(data);
  return true;
}

async function saveToken(data: TokenResponse) {
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);
  await prisma.melhorEnvioToken.upsert({
    where: { id: TOKEN_ID },
    create: {
      id: TOKEN_ID,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
    },
    update: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
    },
  });
}

export async function getMelhorEnvioAccessToken(): Promise<string | null> {
  const record = await prisma.melhorEnvioToken.findUnique({ where: { id: TOKEN_ID } });
  if (!record) return null;

  const isExpiringSoon = record.expiresAt.getTime() - Date.now() < 5 * 60 * 1000;
  if (isExpiringSoon) {
    const refreshed = await refreshToken(record.refreshToken);
    if (!refreshed) return null;
    const updated = await prisma.melhorEnvioToken.findUnique({ where: { id: TOKEN_ID } });
    return updated?.accessToken ?? null;
  }

  return record.accessToken;
}

export async function isMelhorEnvioConnected(): Promise<boolean> {
  const record = await prisma.melhorEnvioToken.findUnique({ where: { id: TOKEN_ID } });
  return !!record;
}

export async function disconnectMelhorEnvio() {
  await prisma.melhorEnvioToken.deleteMany({ where: { id: TOKEN_ID } });
}
