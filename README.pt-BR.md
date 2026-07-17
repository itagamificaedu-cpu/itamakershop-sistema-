# Loja Virtual Moderna

Uma loja virtual completa construída com Next.js 14, TypeScript, Tailwind CSS, Prisma e NextAuth.js.

## Funcionalidades

- 🛍️ **Catálogo de Produtos** com categorias, busca e filtros
- 🛒 **Carrinho de Compras** funcional
- 💳 **Processo de Checkout** com resumo do pedido
- ⭐ **Avaliações de Produtos** e classificações
- ❤️ **Lista de Desejos** para salvar itens favoritos
- 🧾 **Histórico de Pedidos** para acompanhar compras anteriores
- 🔍 **Sistema de Busca** com autocompletar
- 🏷️ **Filtros por Categoria** para navegação fácil
- 👤 **Autenticação de Usuários** com NextAuth.js
- 🔐 **Painel Administrativo** para gerenciar produtos, pedidos e mais
- 📱 **Design Responsivo** funciona em celulares, tablets e desktops
- 🌓 **Suporte ao Modo Escuro**

## Stack Tecnológica

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **Estilização**: Tailwind CSS com componentes shadcn/ui
- **Gerenciamento de Estado**: React Hooks e Context API
- **Processamento de Pagamentos**: Stripe (simulado nesta demonstração)

## Começando

### Pré-requisitos

- Node.js 18+ e npm/yarn/pnpm
- Banco de dados PostgreSQL

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/loja-virtual-moderna.git
   cd loja-virtual-moderna
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env.local` e preencha os valores necessários:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce?schema=public"
   NEXTAUTH_SECRET="seu-segredo-nextauth"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sua-chave-secreta-stripe"
   STRIPE_WEBHOOK_SECRET="seu-segredo-webhook-stripe"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="sua-chave-publicavel-stripe"
   ```

4. Configure o banco de dados:
   ```bash
   npx prisma migrate dev --name init
   # ou
   yarn prisma migrate dev --name init
   # ou
   pnpm prisma migrate dev --name init
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

6. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Estrutura do Projeto

```
src/
├── app/                  # Next.js App Router
│   ├── admin/            # Páginas do painel administrativo
│   ├── api/              # Rotas da API
│   ├── cart/             # Página do carrinho de compras
│   ├── checkout/         # Páginas do fluxo de checkout
│   ├── products/         # Páginas do catálogo de produtos
│   └── ...
├── components/           # Componentes React
│   ├── admin/            # Componentes administrativos
│   ├── cart/             # Componentes do carrinho
│   ├── checkout/         # Componentes de checkout
│   ├── home/             # Componentes da página inicial
│   ├── layout/           # Componentes de layout (cabeçalho, rodapé)
│   ├── products/         # Componentes relacionados a produtos
│   └── ui/               # Componentes de UI
├── lib/                  # Funções utilitárias e bibliotecas
├── prisma/               # Schema do Prisma e migrações
└── ...
```

## Implantação

A aplicação pode ser implantada na Vercel ou em qualquer outra plataforma que suporte Next.js.

```bash
# Build para produção
npm run build
# ou
yarn build
# ou
pnpm build
```

## Licença

Este projeto está licenciado sob a Licença MIT.

## Agradecimentos

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Stripe](https://stripe.com/) 