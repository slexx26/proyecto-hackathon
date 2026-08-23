import { useState } from 'react'
import type { ProductCategory, ProductImage as ProductImageData } from '@/types/product'
import { CategoryIllustration } from '@/components/illustrations/CategoryIllustration'
import { cn } from '@/utils/cn'

/**
 * Imagen de producto con reserva ilustrada.
 *
 * El catálogo de demostración no trae fotografías, y no debería traerlas:
 * usar fotos de personas o de marcas reales sería falsear el origen de los
 * datos (sección 26). Antes se pintaba un rectángulo con la palabra "ADAPTA",
 * que a doce tarjetas seguidas no distingue una silla de ruedas de un
 * pantalón.
 *
 * Ahora se dibuja la categoría, en vector y dentro del bundle. El `alt` de la
 * prenda se sigue respetando, así que la pantalla se lee igual con o sin
 * dibujo.
 */

interface ProductImageProps {
  image: ProductImageData | undefined
  category: ProductCategory
  className?: string
}

export function ProductImage({ image, category, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  if (!image || failed) {
    return (
      <div
        role="img"
        aria-label={image?.alt ?? 'Ilustración de la categoría del producto'}
        className={cn('overflow-hidden bg-brand-soft', className)}
      >
        <CategoryIllustration
          category={category}
          className="transition-transform duration-500 ease-(--ease-out-strong) group-hover:scale-105"
        />
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
