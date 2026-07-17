"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    setSaving(true)

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    setSaving(false)

    if (res.ok) {
      router.refresh()
    } else {
      setStatus(currentStatus)
    }
  }

  return (
    <select
      className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm"
      value={status}
      onChange={handleChange}
      disabled={saving}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}
