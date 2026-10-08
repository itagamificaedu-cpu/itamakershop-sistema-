import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PromoBar from "@/components/layout/promo-bar";
import BotaoWhatsappFlutuante from "@/components/layout/botao-whatsapp-flutuante";
import AssistenteSite from "@/components/layout/assistente-site";
import { SITE_URL } from "@/lib/contato";
import Providers from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ItaMakerShop | Impressão 3D e Corte a Laser",
  description: "Loja online de produtos de impressão 3D e corte a laser sob medida.",
  openGraph: {
    type: "website",
    siteName: "ItaMakerShop",
    title: "ItaMakerShop | Impressão 3D e Corte a Laser",
    description: "Loja online de produtos de impressão 3D e corte a laser sob medida.",
    images: [{ url: "/og-logo.jpg", width: 630, height: 630, alt: "ItaMakerShop" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <PromoBar />
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <BotaoWhatsappFlutuante />
            <AssistenteSite />
          </div>
        </Providers>
      </body>
    </html>
  );
}
