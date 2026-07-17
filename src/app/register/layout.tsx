import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro - ItaMakerShop",
  description: "Crie sua conta",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 