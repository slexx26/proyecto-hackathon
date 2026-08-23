import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { LandingPage } from '@/pages/LandingPage'
import { FindMyFitPage } from '@/pages/FindMyFitPage'
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { MarketplacePage } from '@/pages/MarketplacePage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * Sección 6. Rutas del producto. Todas cuelgan de `RootLayout`, que aporta
 * cabecera, pie, salto de contenido y el asistente.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'find-my-fit', element: <FindMyFitPage /> },
      { path: 'recommendations', element: <RecommendationsPage /> },
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'products/:productId', element: <ProductDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
