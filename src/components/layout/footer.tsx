import Link from "next/link"
import { Printer } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/70 bg-background">
      <div className="container px-4 py-14 md:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Printer className="h-4 w-4" />
              </span>
              <span className="font-heading text-base font-bold">
                Ita<span className="text-primary">MakerShop</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Impressão 3D e corte a laser sob medida, com qualidade profissional.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold">Loja</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold">Conta</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/profile"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entrar
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold">Contato</h3>
            <ul className="space-y-2.5">
              <li className="text-sm text-muted-foreground">
                itagamificaedu@gmail.com
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-8 mt-10 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ItaMakerShop. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
