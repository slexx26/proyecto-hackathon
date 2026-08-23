import { Outlet } from 'react-router-dom'
import { SkipLink } from '@/components/accessibility/SkipLink'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { ChatbotWidget } from '@/features/chatbot/ChatbotWidget'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function RootLayout() {
  useScrollToTop()

  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader />

      {/* `tabIndex={-1}` para que el salto de contenido pueda enfocar aquí. */}
      <main id="contenido" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
      <ChatbotWidget />
    </div>
  )
}
