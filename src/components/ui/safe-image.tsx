"use client"

import Image from "next/image"
import { ImageOff } from "lucide-react"

interface SafeImageProps {
  src?: string | null
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function SafeImage({ src, alt, fill, width, height, className, priority }: SafeImageProps) {
  if (!src) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-secondary/50 ${fill ? "absolute inset-0" : ""} ${className ?? ""}`}
        style={!fill ? { width, height } : undefined}
      >
        <ImageOff className="h-8 w-8 text-muted-foreground/60" strokeWidth={1.5} />
        <span className="px-2 text-center text-xs font-medium text-muted-foreground/70 line-clamp-1">
          {alt}
        </span>
      </div>
    )
  }

  if (fill) {
    return <Image src={src} alt={alt} fill className={className} priority={priority} />
  }

  return <Image src={src} alt={alt} width={width} height={height} className={className} priority={priority} />
}
