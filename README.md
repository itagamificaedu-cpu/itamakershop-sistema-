# Modern E-commerce Store

A complete e-commerce store built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and NextAuth.js.

[Leia em Português](./INSTRUCOES.md)

## Features

- 🛍️ **Product Catalog** with categories, search, and filters
- 🛒 **Functional Shopping Cart**
- 💳 **Checkout Process** with order summary
- ⭐ **Product Reviews** and ratings
- ❤️ **Wishlist** for saving favorite items
- 🧾 **Order History** to track past purchases
- 🔍 **Search System** with autocomplete
- 🏷️ **Category Filters** for easy navigation
- 👤 **User Authentication** with NextAuth.js
- 🔐 **Admin Dashboard** to manage products, orders, and more
- 📱 **Responsive Design** works on mobile, tablet, and desktop
- 🌓 **Dark Mode Support**

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Hooks and Context API
- **Payment Processing**: Stripe (simulated in this demo)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database

### Initial Setup

1. Run the setup script:
   ```bash
   node setup.js
   ```

   This script:
   - Installs all necessary dependencies
   - Creates directories for images
   - Generates Prisma client
   - Provides instructions for next steps

2. Set up environment variables:
   - Make sure the `.env` file is configured with your database URL:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce?schema=public"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. Initialize the database:
   ```bash
   npx prisma db push
   npm run seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   ├── cart/             # Shopping cart page
│   ├── checkout/         # Checkout flow pages
│   ├── products/         # Product catalog pages
│   └── ...
├── components/           # React components
│   ├── admin/            # Admin components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   ├── home/             # Home page components
│   ├── layout/           # Layout components (header, footer)
│   ├── products/         # Product-related components
│   └── ui/               # UI components
├── lib/                  # Utility functions and libraries
├── prisma/               # Prisma schema and migrations
└── ...
```

## Test Credentials

You can login with the following credentials:

- **Regular User**:
  - Email: user@example.com
  - Password: user123

- **Admin**:
  - Email: admin@example.com
  - Password: admin123

## Troubleshooting

### Tailwind CSS Errors

If you encounter errors related to Tailwind CSS:

1. Check that `src/app/globals.css` is correctly configured:
   ```css
   @import "tailwindcss/preflight";
   @tailwind utilities;
   ```

2. Make sure `tailwind.config.ts` is correctly configured:
   ```typescript
   const config: Config = {
     darkMode: "class",
     // ...rest of config
   }
   ```

### Package Compatibility Issues

If you encounter package compatibility issues:

```bash
npm install --legacy-peer-deps
```

## Deployment

The application can be deployed on Vercel or any other platform that supports Next.js.

```bash
# Build for production
npm run build
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Stripe](https://stripe.com/)
