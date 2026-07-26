import { formatPrice } from "@/lib/utils"
import { getInstallmentPlan, getPixPrice, PIX_DISCOUNT_LABEL } from "@/lib/pricing"

export default function PriceDisplay({ price, size = "sm" }: { price: number; size?: "sm" | "lg" }) {
  const { installments, installmentValue } = getInstallmentPlan(price)
  const pixPrice = getPixPrice(price)

  return (
    <div className="space-y-0.5">
      <div className={size === "lg" ? "font-heading text-2xl font-bold" : "font-heading text-lg font-bold"}>
        {formatPrice(price)}
      </div>
      {installments > 1 && (
        <div className="text-xs text-muted-foreground">
          {installments}x de {formatPrice(installmentValue)} sem juros
        </div>
      )}
      <div className="text-xs text-muted-foreground">
        {formatPrice(pixPrice)} com Pix ({PIX_DISCOUNT_LABEL} de desconto)
      </div>
    </div>
  )
}
