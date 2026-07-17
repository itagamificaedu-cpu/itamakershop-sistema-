"use client"

import Link from "next/link"
import { ShoppingCart, Menu, Search, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ThemeToggle from "@/components/theme-toggle"
import SearchBar from "@/components/search-bar"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
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
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <Link href="/" className="text-xl font-bold">
            ItaMakerShop
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Todos os Produtos
          </Link>
        </nav>
        <div className="flex items-center gap-2">
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
        <div className="md:hidden border-t">
          <div className="container p-4 space-y-3">
            <Link
              href="/products"
              className="block text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Todos os Produtos
            </Link>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t">
          <div className="container p-4">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}
    </header>
  )
}
