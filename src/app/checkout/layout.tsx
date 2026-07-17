import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - ItaMakerShop",
  description: "Finalize sua compra",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 