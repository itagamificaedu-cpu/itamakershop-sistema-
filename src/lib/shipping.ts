export const STORE_ADDRESS = {
  street: "Rua Brisa do Norte",
  number: "1017",
  neighborhood: "Nova Aldeota",
  city: "Itapipoca",
  state: "CE",
  postalCode: "62504775",
};

export const LOCAL_DELIVERY_FEE = 8;

export type DeliveryMethod = "PICKUP" | "LOCAL" | "SHIPPING";

export interface CartItemForShipping {
  quantity: number;
  weightKg: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
}

export function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, "");
}

interface ViaCepResult {
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function lookupCep(cep: string): Promise<ViaCepResult | null> {
  const clean = normalizeCep(cep);
  if (clean.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}

export async function isLocalDelivery(cep: string): Promise<boolean> {
  const result = await lookupCep(cep);
  if (!result) return false;
  return (
    result.localidade?.toLowerCase() === STORE_ADDRESS.city.toLowerCase() &&
    result.uf?.toUpperCase() === STORE_ADDRESS.state
  );
}

interface MelhorEnvioOption {
  id: number;
  name: string;
  price: string;
  error?: string;
  delivery_time?: number;
}

export async function quoteMelhorEnvioFreight(
  destinationCep: string,
  items: CartItemForShipping[]
): Promise<{ price: number; carrier: string; deliveryDays: number | null } | null> {
  const token = process.env.MELHOR_ENVIO_TOKEN;
  if (!token) return null;

  const clean = normalizeCep(destinationCep);
  if (clean.length !== 8) return null;

  const totalWeight = items.reduce((sum, i) => sum + i.weightKg * i.quantity, 0);
  const maxHeight = Math.max(...items.map((i) => i.heightCm), 2);
  const maxWidth = Math.max(...items.map((i) => i.widthCm), 11);
  const maxLength = Math.max(...items.map((i) => i.lengthCm), 16);

  try {
    const res = await fetch(
      "https://melhorenvio.com.br/api/v2/me/shipment/calculate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "ItaMakerShop (itagamificaedu@gmail.com)",
        },
        body: JSON.stringify({
          from: { postal_code: STORE_ADDRESS.postalCode },
          to: { postal_code: clean },
          package: {
            height: maxHeight,
            width: maxWidth,
            length: maxLength,
            weight: Math.max(totalWeight, 0.1),
          },
        }),
      }
    );

    if (!res.ok) return null;

    const options: MelhorEnvioOption[] = await res.json();
    const valid = options.filter((o) => !o.error && o.price);
    if (valid.length === 0) return null;

    const cheapest = valid.reduce((min, o) =>
      parseFloat(o.price) < parseFloat(min.price) ? o : min
    );

    return {
      price: parseFloat(cheapest.price),
      carrier: cheapest.name,
      deliveryDays: cheapest.delivery_time ?? null,
    };
  } catch {
    return null;
  }
}
