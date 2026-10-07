export const SITE_URL = "https://itamakershop.itatecnologiaeducacional.tech"
export const WHATSAPP_NUMERO = "5588981681498"
export const WHATSAPP_EXIBICAO = "(88) 98168-1498"
export const INSTAGRAM_URL = "https://www.instagram.com/itamakershop/"
export const INSTAGRAM_USUARIO = "@itamakershop"

export function linkWhatsapp(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`
}
