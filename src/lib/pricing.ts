const MIN_INSTALLMENT_VALUE = 5;
const MAX_INSTALLMENTS = 3;
const PIX_DISCOUNT_PERCENT = 3;

export function getInstallmentPlan(price: number) {
  const installments = Math.max(1, Math.min(MAX_INSTALLMENTS, Math.floor(price / MIN_INSTALLMENT_VALUE)));
  return {
    installments,
    installmentValue: price / installments,
  };
}

export function getPixPrice(price: number) {
  return price * (1 - PIX_DISCOUNT_PERCENT / 100);
}

export const PIX_DISCOUNT_LABEL = `${PIX_DISCOUNT_PERCENT}%`;
