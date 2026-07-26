const ANNOUNCEMENT_DEADLINE = new Date("2026-08-01T00:00:00-03:00")
const ANNOUNCEMENT_MESSAGE =
  "🔧 Em desenvolvimento: vendas e encomendas a partir de 01/08/26. Pedidos e encomendas pelo direct ou WhatsApp!"
const DEFAULT_MESSAGE = "🚚 Retire na loja em Itapipoca sem pagar frete — ou fale com a gente no WhatsApp!"

export default function PromoBar() {
  const message = new Date() < ANNOUNCEMENT_DEADLINE ? ANNOUNCEMENT_MESSAGE : DEFAULT_MESSAGE

  return (
    <div className="w-full bg-primary py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
      {message}
    </div>
  )
}
