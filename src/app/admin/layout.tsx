import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
            <p className="text-muted-foreground">
              Gerencie produtos, categorias e pedidos da ItaMakerShop
            </p>
          </div>
        </div>

        <nav className="flex gap-4 border-b pb-4">
          <Link href="/admin" className="text-sm font-medium hover:text-primary">
            Visão Geral
          </Link>
          <Link href="/admin/products" className="text-sm font-medium hover:text-primary">
            Produtos
          </Link>
          <Link href="/admin/categorias" className="text-sm font-medium hover:text-primary">
            Categorias
          </Link>
          <Link href="/admin/pedidos" className="text-sm font-medium hover:text-primary">
            Pedidos
          </Link>
          <Link href="/admin/frete" className="text-sm font-medium hover:text-primary">
            Frete
          </Link>
        </nav>

        {children}
      </div>
    </div>
  );
}
