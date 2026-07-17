"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  productId?: string
  initialData?: {
    name: string
    description: string
    price: number
    images: string[]
    categoryId: string
    featured: boolean
    inventory: number
  }
}

export default function ProductForm({ categories, productId, initialData }: ProductFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "")
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? categories[0]?.id ?? "")
  const [inventory, setInventory] = useState(initialData?.inventory?.toString() ?? "0")
  const [featured, setFeatured] = useState(initialData?.featured ?? false)
  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Erro ao enviar imagem")
        return
      }

      setImages((prev) => [...prev, data.url])
    } catch {
      setError("Erro ao enviar imagem")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (images.length === 0) {
      setError("Adicione pelo menos uma imagem")
      return
    }

    setSaving(true)

    const payload = {
      name,
      description,
      price: parseFloat(price),
      categoryId,
      inventory: parseInt(inventory, 10),
      featured,
      images,
    }

    try {
      const res = await fetch(
        productId ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Erro ao salvar produto")
        setSaving(false)
        return
      }

      router.push("/admin/products")
      router.refresh()
    } catch {
      setError("Erro ao salvar produto")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Preço (R$)</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estoque</label>
          <Input
            type="number"
            min="0"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoria</label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        <label htmlFor="featured" className="text-sm font-medium">
          Produto em destaque (aparece na home)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Imagens</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img) => (
            <div key={img} className="relative h-20 w-20 rounded-md overflow-hidden border">
              <Image src={img} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img)}
                className="absolute top-0 right-0 bg-black/60 rounded-bl p-0.5"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
        <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
        {uploading && (
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" /> Enviando...
          </p>
        )}
      </div>

      <Button type="submit" disabled={saving || uploading}>
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
          </>
        ) : productId ? (
          "Salvar Alterações"
        ) : (
          "Criar Produto"
        )}
      </Button>
    </form>
  )
}
