"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onClose: () => void
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar produtos..."
          className="w-full bg-background pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar busca</span>
        </Button>
      </div>
    </form>
  )
} 