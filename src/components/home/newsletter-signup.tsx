"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setEmail("")
      setLoading(false)
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm mx-auto items-center space-x-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 bg-white/10 text-white placeholder:text-white/60 border-white/20"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      
      {success && (
        <div className="mt-2 text-center text-sm">
          Thank you for subscribing! Check your email for the discount code.
        </div>
      )}
    </div>
  )
} 