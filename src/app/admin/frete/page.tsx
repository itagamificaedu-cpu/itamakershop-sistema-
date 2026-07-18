import FreteStatus from "@/components/admin/frete-status";

export const dynamic = "force-dynamic";

export default async function AdminFretePage({
  searchParams,
}: {
  searchParams: Promise<{ conectado?: string; erro?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Frete</h2>
      <p className="text-muted-foreground text-sm">
        Retirada na loja e entrega local em Itapipoca já funcionam automaticamente.
        Conecte o Melhor Envio para calcular frete real (Correios/transportadoras)
        para pedidos de fora de Itapipoca.
      </p>

      {params.conectado === "1" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Melhor Envio conectado com sucesso!
        </div>
      )}
      {params.erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Não foi possível conectar o Melhor Envio. Tente novamente.
        </div>
      )}

      <FreteStatus />
    </div>
  );
}
