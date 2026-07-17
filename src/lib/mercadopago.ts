import { MercadoPagoConfig } from "mercadopago";

let client: MercadoPagoConfig | null = null;

export function getMpClient() {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado no .env");
  }

  if (!client) {
    client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
  }

  return client;
}
