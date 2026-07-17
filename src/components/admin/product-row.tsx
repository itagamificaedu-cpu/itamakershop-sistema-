"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ProductRowProps {
  product: {
    id: string
    name: string
    category: string
    price: string
    inventory: number
    featured: boolean
  }
}

export default function ProductRow({ product }: ProductRowProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    if (!confirm(`Excluir "${product.name}"? Essa ação não pode ser desfeita.`)) return

    setDeleting(true)
    setError("")

    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" })
    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      setDeleting(false)
      return
    }

    router.refresh()
  }

  return (
    <tr className="border-b last:border-0 hover:bg-muted/30">
      <td className="px-4 py-3">{product.name}</td>
      <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
      <td className="px-4 py-3">{product.price}</td>
      <td className="px-4 py-3">
        <span className={product.inventory <= 2 ? "text-red-500 font-medium" : ""}>
          {product.inventory}
        </span>
      </td>
      <td className="px-4 py-3">{product.featured ? "Sim" : "Não"}</td>
      <td className="px-4 py-3 text-right space-x-2">
        {error && <span className="text-xs text-red-500 block mb-1">{error}</span>}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/products/${product.id}`}>Editar</Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Excluindo..." : "Excluir"}
        </Button>
      </td>
    </tr>
  )
}
