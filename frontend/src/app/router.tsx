import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { LandingPage } from '@/pages/LandingPage'
import { FindMyFitPage } from '@/pages/FindMyFitPage'
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { MarketplacePage } from '@/pages/MarketplacePage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { ProvidersPage } from '@/pages/ProvidersPage'
import { ProviderDetailPage } from '@/pages/ProviderDetailPage'
import { ForBusinessPage } from '@/pages/ForBusinessPage'
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
      { path: 'providers', element: <ProvidersPage /> },
      { path: 'providers/:providerId', element: <ProviderDetailPage /> },
      { path: 'for-business', element: <ForBusinessPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
