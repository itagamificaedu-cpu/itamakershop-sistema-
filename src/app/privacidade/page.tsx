import type { Metadata } from "next"
import PaginaLegal from "@/components/layout/pagina-legal"
import { INSTAGRAM_URL, INSTAGRAM_USUARIO, SITE_URL, WHATSAPP_EXIBICAO } from "@/lib/contato"

export const metadata: Metadata = {
  title: "Política de Privacidade - ItaMakerShop",
  description: "Como a ItaMakerShop coleta, usa e protege os seus dados.",
}

export default function PaginaPrivacidade() {
  return (
    <PaginaLegal titulo="Política de Privacidade" atualizadoEm="07/10/2026">
      <p>
        A ItaMakerShop é uma loja de impressão 3D e corte a laser de Itapipoca, Ceará. Esta página
        explica, de forma simples, quais dados a gente recebe quando você usa o nosso site
        ({SITE_URL}), manda mensagem pelo Instagram ou pede um orçamento, e o que fazemos com eles.
      </p>

      <section>
        <h2>Quais dados coletamos</h2>
        <ul>
          <li>
            <strong>Cadastro e compras no site:</strong> nome, e-mail, senha (guardada de forma
            protegida), endereço de entrega e telefone, quando você informa.
          </li>
          <li>
            <strong>Pagamento:</strong> quem processa é o Mercado Pago. A gente não vê nem guarda
            os dados do seu cartão.
          </li>
          <li>
            <strong>Frete:</strong> CEP e endereço são usados para calcular e enviar o pedido, com
            apoio do Melhor Envio.
          </li>
          <li>
            <strong>Mensagens pelo Instagram:</strong> quando você escreve para o nosso perfil{" "}
            {INSTAGRAM_USUARIO}, recebemos o texto da mensagem, o identificador da sua conta no
            Instagram e o horário. Usamos a Meta (dona do Instagram) para receber e responder essas
            mensagens.
          </li>
          <li>
            <strong>Assistente virtual do site:</strong> as perguntas que você escreve no chat são
            enviadas a um serviço de inteligência artificial (Anthropic) só para gerar a resposta.
            A gente não guarda a conversa e não pede dados pessoais no chat. Evite escrever senha,
            CPF ou dados de cartão.
          </li>
          <li>
            <strong>Newsletter:</strong> o e-mail que você cadastrar no rodapé do site.
          </li>
        </ul>
      </section>

      <section>
        <h2>Para que usamos</h2>
        <ul>
          <li>Responder suas dúvidas e fazer orçamentos.</li>
          <li>Processar, produzir e entregar o seu pedido.</li>
          <li>Enviar avisos sobre o pedido e, se você aceitou, novidades da loja.</li>
          <li>Cumprir obrigações legais, como a emissão de documentos fiscais.</li>
        </ul>
        <p className="mt-2">
          A gente não vende os seus dados e não os usa para nada diferente do que está escrito aqui.
        </p>
      </section>

      <section>
        <h2>Com quem compartilhamos</h2>
        <p>
          Só com quem precisa para a loja funcionar: Mercado Pago (pagamento), Melhor Envio e
          transportadoras (entrega), Meta (Instagram), Anthropic (assistente virtual) e o serviço de hospedagem do site. Cada um
          trata os dados conforme as próprias regras de privacidade.
        </p>
      </section>

      <section>
        <h2>Por quanto tempo guardamos</h2>
        <p>
          Guardamos os dados enquanto forem necessários para o atendimento e para as obrigações da
          loja, como garantia e notas fiscais. Mensagens de atendimento podem ser apagadas a seu
          pedido.
        </p>
      </section>

      <section>
        <h2>Seus direitos</h2>
        <p>
          Pela Lei Geral de Proteção de Dados (LGPD), você pode pedir para saber quais dados
          temos, corrigir, receber uma cópia ou apagar. Para isso, veja a página de{" "}
          <a href="/exclusao-de-dados" className="text-primary underline">
            exclusão de dados
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Contato</h2>
        <p>
          Fale com a gente pelo WhatsApp {WHATSAPP_EXIBICAO}, pelo Instagram{" "}
          <a href={INSTAGRAM_URL} className="text-primary underline" target="_blank" rel="noopener noreferrer">
            {INSTAGRAM_USUARIO}
          </a>{" "}
          ou pelo e-mail itagamificaedu@gmail.com.
        </p>
      </section>
    </PaginaLegal>
  )
}
