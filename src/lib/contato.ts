export const SITE_URL = "https://itamakershop.itatecnologiaeducacional.tech"
export const WHATSAPP_NUMERO = "5588988411890"
export const WHATSAPP_EXIBICAO = "(88) 98841-1890"
export const INSTAGRAM_URL = "https://www.instagram.com/itamakershop/"
export const INSTAGRAM_USUARIO = "@itamakershop"

export function linkWhatsapp(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`
}
