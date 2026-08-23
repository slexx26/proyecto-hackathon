import { useState } from 'react'
import type { ProductImage as ProductImageData } from '@/types/product'
import { cn } from '@/utils/cn'

/**
 * Imagen de producto con reserva.
 *
 * El catálogo de demo no trae fotografías: usar fotos de personas o de marcas
 * reales sería falsear el origen de los datos (sección 26). Mientras no haya
 * imágenes propias, se pinta un marcador tipográfico. El `alt` de la prenda se
 * sigue respetando, así que la pantalla se lee igual con o sin foto.
 */

interface ProductImageProps {
  image: ProductImageData | undefined
  className?: string
}

export function ProductImage({ image, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  if (!image || failed) {
    return (
      <div
        role="img"
        aria-label={image?.alt ?? 'Imagen de la prenda no disponible'}
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200',
          className,
        )}
      >
        <span aria-hidden="true" className="text-3xl font-semibold text-brand-700/60">
          ADAPTA
        </span>
      </div>
    )
  }

  return (
    <img
      src={image.url}
      alt={image.alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('w-full object-cover', className)}
    />
  )
}
