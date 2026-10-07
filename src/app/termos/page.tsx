import type { Metadata } from "next"
import PaginaLegal from "@/components/layout/pagina-legal"
import { INSTAGRAM_URL, INSTAGRAM_USUARIO, WHATSAPP_EXIBICAO } from "@/lib/contato"

export const metadata: Metadata = {
  title: "Termos de Uso - ItaMakerShop",
  description: "Regras para usar o site e comprar na ItaMakerShop.",
}

export default function PaginaTermos() {
  return (
    <PaginaLegal titulo="Termos de Uso" atualizadoEm="07/10/2026">
      <p>
        Ao usar o site da ItaMakerShop ou conversar com a loja, você concorda com as regras abaixo.
        São poucas e diretas.
      </p>

      <section>
        <h2>Sobre os produtos</h2>
        <p>
          Os produtos são feitos em impressão 3D e corte a laser, muitos sob medida. Pequenas
          diferenças de cor e acabamento podem acontecer, porque cada peça é produzida de forma
          artesanal. As fotos são ilustrativas.
        </p>
      </section>

      <section>
        <h2>Preços, pedidos e orçamentos</h2>
        <p>
          Os preços aparecem no site em reais. Produtos marcados como &quot;sob consulta&quot; dependem de
          orçamento, que é combinado pelo WhatsApp ou pelo Instagram. Um orçamento só vale depois
          de confirmado pela loja.
        </p>
      </section>

      <section>
        <h2>Pagamento e entrega</h2>
        <p>
          O pagamento é feito pelo Mercado Pago. A entrega pode ser por retirada em Itapipoca, por
          entrega local ou pelos Correios, e o prazo e o valor do frete aparecem antes de você
          finalizar o pedido.
        </p>
      </section>

      <section>
        <h2>Trocas e devoluções</h2>
        <p>
          Produtos com defeito de fabricação podem ser trocados. Peças personalizadas, feitas com
          o seu nome ou a sua arte, só podem ser trocadas se houver erro nosso. Fale com a gente em
          até 7 dias depois de receber.
        </p>
      </section>

      <section>
        <h2>Atendimento pelo Instagram e WhatsApp</h2>
        <p>
          A gente responde mensagens no horário comercial. Algumas respostas podem ser enviadas por
          ferramentas automáticas de apoio, e sempre é possível falar com uma pessoa da equipe.
        </p>
      </section>

      <section>
        <h2>Privacidade</h2>
        <p>
          O uso dos seus dados está explicado na{" "}
          <a href="/privacidade" className="text-primary underline">
            Política de Privacidade
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Contato</h2>
        <p>
          WhatsApp {WHATSAPP_EXIBICAO} ou Instagram{" "}
          <a href={INSTAGRAM_URL} className="text-primary underline" target="_blank" rel="noopener noreferrer">
            {INSTAGRAM_USUARIO}
          </a>
          .
        </p>
      </section>
    </PaginaLegal>
  )
}
