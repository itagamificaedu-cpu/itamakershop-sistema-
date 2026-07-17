"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddToCartButtonProps {
  productId: string
  disabled?: boolean
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export default function AddToCartButton({
  productId,
  disabled,
  className,
  size = "sm",
}: AddToCartButtonProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">("idle")

  const handleClick = async () => {
    setStatus("loading")

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      if (!res.ok) {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 2000)
        return
      }

      setStatus("added")
      router.refresh()
      setTimeout(() => setStatus("idle"), 1500)
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 2000)
    }
  }

  return (
    <Button
      className={className}
      size={size}
      disabled={disabled || status === "loading"}
      onClick={handleClick}
    >
      {status === "loading" ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : status === "added" ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <ShoppingCart className="mr-2 h-4 w-4" />
      )}
      {status === "added" ? "Adicionado" : status === "error" ? "Erro, tente de novo" : "Adicionar ao Carrinho"}
    </Button>
  )
}
