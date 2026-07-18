"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, Search, Shield, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSession } from "next-auth/react"
import ThemeToggle from "@/components/theme-toggle"
import SearchBar from "@/components/search-bar"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Abrir Menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/40 shadow-sm transition-transform group-hover:scale-105">
              <Image src="/logo.png" alt="ItaMakerShop" fill className="object-cover scale-105" />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">
              Ita<span className="text-primary">MakerShop</span>
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Todos os Produtos
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
          <ThemeToggle />
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrinho</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Minha Conta</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md">
          <div className="container p-4 space-y-3">
            <Link
              href="/products"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Todos os Produtos
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-md">
          <div className="container p-4">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}
    </header>
  )
}
