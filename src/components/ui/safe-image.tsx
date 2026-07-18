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
        className={`flex items-center justify-center bg-muted ${fill ? "absolute inset-0" : ""} ${className ?? ""}`}
        style={!fill ? { width, height } : undefined}
      >
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  if (fill) {
    return <Image src={src} alt={alt} fill className={className} priority={priority} />
  }

  return <Image src={src} alt={alt} width={width} height={height} className={className} priority={priority} />
}
