import { env } from '@/config/env'
import { ApiError } from '@/types/api'
import type { Product, ProductFilters } from '@/types/product'
import { mockProducts } from '@/services/mocks/products.mock'
import { mockDelay, request } from './client'

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  const search = filters.search?.trim().toLowerCase()

  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (
      filters.adaptationNeed &&
      !product.adaptationNeeds.includes(filters.adaptationNeed)
    ) {
      return false
    }
    if (search) {
      const haystack =
        `${product.name} ${product.brand} ${product.description}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }
    return true
  })
}

export function fetchProducts(
  filters: ProductFilters = {},
  signal?: AbortSignal,
): Promise<Product[]> {
  if (env.useMockApi) {
    return mockDelay(applyFilters(mockProducts, filters))
  }

  return request<Product[]>('/products', {
    query: {
      search: filters.search,
      category: filters.category,
      adaptation_need: filters.adaptationNeed,
    },
    signal,
  })
}

export function fetchProductById(
  productId: string,
  signal?: AbortSignal,
): Promise<Product> {
  if (env.useMockApi) {
    const product = mockProducts.find((item) => item.id === productId)
    if (!product) {
      return Promise.reject(new ApiError('Producto no encontrado.', 404))
    }
    return mockDelay(product)
  }

  return request<Product>(`/products/${encodeURIComponent(productId)}`, {
    signal,
  })
}
