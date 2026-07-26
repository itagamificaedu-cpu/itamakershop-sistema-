const PROMO_MESSAGE = "🚚 Retire na loja em Itapipoca sem pagar frete — ou fale com a gente no WhatsApp!"

export default function PromoBar() {
  return (
    <div className="w-full bg-primary py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
      {PROMO_MESSAGE}
    </div>
  )
}
