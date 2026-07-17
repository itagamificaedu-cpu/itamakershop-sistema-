import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar - ItaMakerShop",
  description: "Acesse sua conta",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 