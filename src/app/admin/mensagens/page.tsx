import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const NOMES_CANAIS: Record<string, string> = {
  instagram: "Instagram",
  whatsapp: "WhatsApp",
};

function formatarHorario(data: Date) {
  return data.toLocaleString("pt-BR", {
    timeZone: "America/Fortaleza",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function textoDaMensagem(texto: string | null) {
  return texto && texto.trim() !== "" ? texto : "(mensagem sem texto: foto, áudio ou figurinha)";
}

export default async function AdminMensagensPage() {
  const mensagens = await prisma.mensagemSocial.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  // Agrupa por canal + contato. Como a lista já vem da mais nova para a mais antiga,
  // a primeira mensagem de cada grupo é a última da conversa.
  const conversas = new Map<string, typeof mensagens>();
  for (const mensagem of mensagens) {
    const chave = `${mensagem.canal}:${mensagem.contato}`;
    const grupo = conversas.get(chave);
    if (grupo) {
      grupo.push(mensagem);
    } else {
      conversas.set(chave, [mensagem]);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mensagens ({conversas.size} conversas)</h2>
      <p className="text-sm text-muted-foreground">
        Mensagens que chegam pelo Instagram e pelo WhatsApp da loja. Por enquanto só dá para
        ler. Para responder, use o Instagram ou o WhatsApp normalmente.
      </p>

      {conversas.size === 0 ? (
        <p className="text-muted-foreground">Nenhuma mensagem ainda.</p>
      ) : (
        <div className="space-y-3">
          {Array.from(conversas.entries()).map(([chave, grupo]) => {
            const ultima = grupo[0];
            const cronologica = [...grupo].reverse();
            return (
              <details key={chave} className="rounded-lg border p-4" open={conversas.size <= 3}>
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="mr-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {NOMES_CANAIS[ultima.canal] ?? ultima.canal}
                    </span>
                    <span className="text-sm font-medium">Contato {ultima.contato}</span>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {textoDaMensagem(ultima.texto)}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{formatarHorario(ultima.createdAt)}</div>
                    <div>{grupo.length} mensagem(ns)</div>
                  </div>
                </summary>

                <div className="mt-4 space-y-2 border-t pt-4">
                  {cronologica.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className={`flex ${mensagem.direcao === "saida" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          mensagem.direcao === "saida"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {textoDaMensagem(mensagem.texto)}
                        </p>
                        <p className="mt-1 text-[10px] opacity-70">
                          {formatarHorario(mensagem.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
