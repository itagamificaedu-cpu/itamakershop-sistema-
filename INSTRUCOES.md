# Loja Virtual Moderna - Guia de Configuração

## Introdução

Esta aplicação é uma loja virtual completa construída com Next.js 14, TypeScript, Tailwind CSS, Prisma e NextAuth.js. Este guia ajudará você a configurar e executar a aplicação localmente.

## Pré-requisitos

- Node.js 18+ instalado
- NPM, Yarn ou PNPM
- PostgreSQL (local ou em nuvem)

## Configuração Inicial

Siga estas etapas para configurar o projeto:

1. **Execute o script de configuração**:

   ```bash
   node setup.js
   ```

   Este script:
   - Instala todas as dependências necessárias
   - Cria os diretórios para imagens
   - Gera o cliente Prisma
   - Fornece instruções para os próximos passos

2. **Configure o banco de dados**:

   Certifique-se de que seu arquivo `.env` esteja configurado corretamente com a URL do banco de dados.
   
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce?schema=public"
   ```

3. **Inicialize o banco de dados**:

   ```bash
   npx prisma db push
   npm run seed
   ```

   Isso criará as tabelas necessárias e populará o banco de dados com dados de exemplo.

## Executando a Aplicação

1. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

2. **Acesse a aplicação**:

   Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000)

## Credenciais de Teste

Você pode fazer login com as seguintes credenciais:

- **Usuário Regular**:
  - Email: user@example.com
  - Senha: user123

- **Administrador**:
  - Email: admin@example.com
  - Senha: admin123

## Problemas Conhecidos e Soluções

### Erro de CSS do Tailwind

Se você encontrar erros relacionados ao Tailwind CSS:

1. Verifique se o arquivo `src/app/globals.css` está configurado corretamente:
   ```css
   @import "tailwindcss/preflight";
   @tailwind utilities;
   ```

2. Certifique-se de que o arquivo `tailwind.config.ts` está configurado corretamente:
   ```typescript
   const config: Config = {
     darkMode: "class",
     // ...resto da configuração
   }
   ```

### Problemas de Compatibilidade de Pacotes

Se você encontrar erros de compatibilidade de pacotes:

```bash
npm install --legacy-peer-deps
```

## Estrutura do Projeto

```
src/
├── app/                  # Páginas e APIs (App Router do Next.js)
│   ├── admin/            # Painel administrativo
│   ├── api/              # Rotas de API (carrinho, autenticação, etc.)
│   ├── cart/             # Página do carrinho
│   ├── checkout/         # Processo de checkout
│   └── products/         # Catálogo de produtos
├── components/           # Componentes React reutilizáveis
├── lib/                  # Funções utilitárias e configurações
└── prisma/               # Schema do Prisma e migrações
```

## Suporte

Se você encontrar problemas durante a configuração ou uso da aplicação, verifique:

1. Se todas as dependências estão instaladas corretamente
2. Se o banco de dados PostgreSQL está configurado e acessível
3. Se você executou todas as etapas de configuração na ordem correta

---

Desenvolvido com ❤️ usando Next.js 14, Tailwind CSS, Prisma e TypeScript. 