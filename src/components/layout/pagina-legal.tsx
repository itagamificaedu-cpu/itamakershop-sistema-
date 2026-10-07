import type { ReactNode } from "react"

// Estrutura comum das páginas de política (privacidade, termos, exclusão de dados).
export default function PaginaLegal({
  titulo,
  atualizadoEm,
  children,
}: {
  titulo: string
  atualizadoEm: string
  children: ReactNode
}) {
  return (
    <div className="container max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <h1 className="font-heading text-3xl font-bold tracking-tight">{titulo}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Atualizado em {atualizadoEm}</p>
      <div className="mt-8 space-y-6 text-justify leading-relaxed text-muted-foreground [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        {children}
      </div>
    </div>
  )
}
