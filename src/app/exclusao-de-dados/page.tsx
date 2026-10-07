import type { Metadata } from "next"
import PaginaLegal from "@/components/layout/pagina-legal"
import { INSTAGRAM_URL, INSTAGRAM_USUARIO, WHATSAPP_EXIBICAO, linkWhatsapp } from "@/lib/contato"

export const metadata: Metadata = {
  title: "Exclusão de Dados - ItaMakerShop",
  description: "Como pedir a exclusão dos seus dados na ItaMakerShop.",
}

export default function PaginaExclusaoDeDados() {
  return (
    <PaginaLegal titulo="Exclusão de dados" atualizadoEm="07/10/2026">
      <p>
        Você pode pedir a qualquer momento que a ItaMakerShop apague os dados que temos sobre você:
        cadastro no site, pedidos que não precisamos guardar por lei, e mensagens trocadas pelo
        Instagram ou pelo WhatsApp.
      </p>

      <section>
        <h2>Como pedir</h2>
        <ul>
          <li>
            Mande uma mensagem pelo WhatsApp{" "}
            <a
              href={linkWhatsapp("Olá! Quero pedir a exclusão dos meus dados na ItaMakerShop.")}
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {WHATSAPP_EXIBICAO}
            </a>
            .
          </li>
          <li>
            Ou escreva no direct do Instagram{" "}
            <a href={INSTAGRAM_URL} className="text-primary underline" target="_blank" rel="noopener noreferrer">
              {INSTAGRAM_USUARIO}
            </a>
            .
          </li>
          <li>Ou envie um e-mail para itagamificaedu@gmail.com com o assunto &quot;Exclusão de dados&quot;.</li>
        </ul>
        <p className="mt-2">
          Para a gente ter certeza de que o pedido é seu, informe o nome e o e-mail do cadastro, ou
          peça pela mesma conta do Instagram em que você conversou com a loja.
        </p>
      </section>

      <section>
        <h2>O que acontece depois</h2>
        <ul>
          <li>Confirmamos o recebimento do pedido.</li>
          <li>Apagamos os dados em até 30 dias e avisamos você quando terminar.</li>
          <li>
            Alguns dados de compras podem precisar ficar guardados por mais tempo, porque a lei
            exige (como notas fiscais). Nesse caso, a gente explica o que ficou e por quê.
          </li>
        </ul>
      </section>

      <section>
        <h2>Dados do Instagram</h2>
        <p>
          Se você usa o Instagram e quer remover o que a loja recebeu de você por lá, é só pedir
          pelos canais acima. Também dá para remover a ItaMakerShop das integrações da sua conta nas
          configurações do próprio Instagram ou do Facebook.
        </p>
      </section>
    </PaginaLegal>
  )
}
