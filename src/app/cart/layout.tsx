import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrinho - ItaMakerShop",
  description: "Veja seu carrinho e finalize a compra",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 