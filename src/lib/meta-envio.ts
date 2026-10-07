// Envio de mensagens pelo Instagram usando a Página da loja.
// Precisa de META_PAGE_TOKEN e META_PAGE_ID no .env; sem eles, o envio é recusado.

const VERSAO_GRAPH = "v26.0";

// A Meta só deixa responder em até 24 horas depois da última mensagem do cliente.
export const JANELA_RESPOSTA_HORAS = 24;

type ResultadoEnvio =
  | { ok: true; idExterno: string | null }
  | { ok: false; erro: string };

export function envioConfigurado() {
  return Boolean(process.env.META_PAGE_TOKEN && process.env.META_PAGE_ID);
}

export async function enviarTextoInstagram(destinatario: string, texto: string): Promise<ResultadoEnvio> {
  const token = process.env.META_PAGE_TOKEN;
  const paginaId = process.env.META_PAGE_ID;
  if (!token || !paginaId) {
    return { ok: false, erro: "Envio ainda não configurado no servidor." };
  }

  try {
    const resposta = await fetch(`https://graph.facebook.com/${VERSAO_GRAPH}/${paginaId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipient: { id: destinatario },
        message: { text: texto },
        messaging_type: "RESPONSE",
      }),
    });

    const dados = (await resposta.json()) as {
      message_id?: string;
      error?: { message?: string };
    };

    if (!resposta.ok) {
      return { ok: false, erro: dados.error?.message ?? "A Meta recusou o envio." };
    }
    return { ok: true, idExterno: dados.message_id ?? null };
  } catch {
    return { ok: false, erro: "Não foi possível falar com a Meta. Tente de novo." };
  }
}
