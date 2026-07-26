"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(false)

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error()

      setSuccess(true)
      setEmail("")
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm mx-auto items-center space-x-2">
        <Input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 bg-white/10 text-white placeholder:text-white/60 border-white/20"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Inscrevendo..." : "Inscrever-se"}
        </Button>
      </form>

      {success && (
        <div className="mt-2 text-center text-sm">
          Inscrito com sucesso! Você vai receber nossas novidades por e-mail.
        </div>
      )}
      {error && (
        <div className="mt-2 text-center text-sm">
          Não deu pra inscrever agora, tenta de novo em instantes.
        </div>
      )}
    </div>
  )
} 