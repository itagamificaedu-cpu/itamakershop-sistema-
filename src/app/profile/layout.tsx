import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu Perfil - ItaMakerShop",
  description: "Gerencie seu perfil e pedidos",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 