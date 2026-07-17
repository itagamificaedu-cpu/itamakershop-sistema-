"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Category {
  id: string
  name: string
  description: string | null
  productCount: number
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      setSaving(false)
      return
    }

    setName("")
    setDescription("")
    setSaving(false)
    router.refresh()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir categoria "${name}"?`)) return

    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    const data = await res.json()

    if (!res.ok) {
      alert(data.message)
      return
    }

    router.refresh()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
        <Input
          placeholder="Nome da categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Adicionar"}
        </Button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="overflow-auto rounded-lg border max-w-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Nome</th>
              <th className="px-4 py-3 text-left font-medium">Produtos</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0">
                <td className="px-4 py-3">{cat.name}</td>
                <td className="px-4 py-3">{cat.productCount}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(cat.id, cat.name)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
