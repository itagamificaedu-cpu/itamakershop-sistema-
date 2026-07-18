"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function FreteStatus() {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    fetch("/api/admin/shipping/melhor-envio/status")
      .then((res) => res.json())
      .then((data) => setConnected(data.connected))
      .catch(() => setConnected(false))
  }, [])

  const handleDisconnect = async () => {
    if (!confirm("Desconectar o Melhor Envio? O frete para fora de Itapipoca vai parar de funcionar até reconectar.")) return
    setDisconnecting(true)
    await fetch("/api/admin/shipping/melhor-envio/status", { method: "DELETE" })
    setConnected(false)
    setDisconnecting(false)
  }

  if (connected === null) {
    return <p className="text-sm text-muted-foreground">Verificando conexão...</p>
  }

  return (
    <div className="rounded-lg border p-6 max-w-md space-y-4">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-green-500" : "bg-gray-400"}`}
        />
        <span className="font-medium">
          Melhor Envio {connected ? "conectado" : "não conectado"}
        </span>
      </div>

      {connected ? (
        <Button variant="outline" onClick={handleDisconnect} disabled={disconnecting}>
          {disconnecting ? "Desconectando..." : "Desconectar"}
        </Button>
      ) : (
        <Button asChild>
          <a href="/api/admin/shipping/melhor-envio/connect">Conectar Melhor Envio</a>
        </Button>
      )}
    </div>
  )
}
