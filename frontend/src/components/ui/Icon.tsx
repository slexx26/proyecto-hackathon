import { cn } from '@/utils/cn'

/**
 * Set de iconos propio, en línea y en un solo archivo.
 *
 * Por qué no emoji: un emoji cambia de dibujo en cada sistema operativo, no
 * hereda el color del texto y los lectores de pantalla lo leen entero
 * ("marca de verificación blanca gruesa"). Un `<svg aria-hidden>` junto a
 * texto real se comporta igual en todas partes.
 *
 * Todos comparten trazo 1.75 y caja de 24: mezclar grosores es lo que hace
 * que un set de iconos se vea comprado a última hora.
 */

export type IconName =
  | 'check'
  | 'partial'
  | 'alert'
  | 'info'
  | 'arrow-right'
  | 'arrow-left'
  | 'close'
  | 'menu'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'search'
  | 'verified'
  | 'external'
  | 'spark'
  | 'chat'
  | 'phone'
  | 'mail'
  | 'globe'
  | 'pin'
  | 'ship'
  | 'scissors'
  | 'store'
  | 'filter'
  | 'shirt'
  | 'wheelchair'
  | 'prosthesis'
  | 'spoon'
  | 'shoe'
  | 'cup'

const paths: Record<IconName, string> = {
  check: 'M4.5 12.5l5 5 10-11',
  partial: 'M4 9.5h16M4 15h9',
  alert: 'M12 8v5m0 3.5v.01M12 3.6l8.7 15.4H3.3z',
  info: 'M12 11v6m0-9.5v.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  'arrow-right': 'M4 12h15m-6-6.5 6.5 6.5-6.5 6.5',
  'arrow-left': 'M20 12H5m6-6.5L4.5 12 11 18.5',
  close: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m12.9-4.9 1.5-1.5M5.6 18.4l1.5-1.5m9.8 0 1.5 1.5M5.6 5.6l1.5 1.5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon: 'M20 14.3A8.5 8.5 0 0 1 9.7 4 8.5 8.5 0 1 0 20 14.3Z',
  monitor: 'M3 5.5h18v11H3zM9 21h6m-3-4.5V21',
  search: 'M20 20l-4.2-4.2M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  verified: 'M12 3l2.4 1.8 3-.2.6 2.9L20.4 9.6 19 12l1.4 2.4-2.4 2.1-.6 2.9-3-.2L12 21l-2.4-1.8-3 .2-.6-2.9L3.6 14.4 5 12 3.6 9.6l2.4-2.1.6-2.9 3 .2Zm-3 8.8 2.2 2.2 4-4.4',
  external: 'M14 4h6v6m0-6-8.5 8.5M18 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5',
  spark: 'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4ZM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z',
  chat: 'M20 12.5c0 3.9-3.6 7-8 7-1 0-2-.2-2.9-.5L4 20.5l1.4-3.9A6.7 6.7 0 0 1 4 12.5c0-3.9 3.6-7 8-7s8 3.1 8 7Z',
  phone: 'M6.5 3.5h3l1.5 4-2 1.4a11 11 0 0 0 5.1 5.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z',
  mail: 'M3 6.5h18v11H3zM3.5 7.2l8.5 6 8.5-6',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-18 0h18M12 3c2.3 2.4 3.5 5.5 3.5 9S14.3 18.6 12 21c-2.3-2.4-3.5-5.5-3.5-9S9.7 5.4 12 3Z',
  pin: 'M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  ship: 'M2 16.5h20M4 16.5V9h11v7.5M15 11.5h3.2l2.3 3.2v1.8M7.5 20a1.8 1.8 0 1 0 0-3.5 1.8 1.8 0 0 0 0 3.5Zm10 0a1.8 1.8 0 1 0 0-3.5 1.8 1.8 0 0 0 0 3.5Z',
  scissors: 'M8 8.5 19 19M8 15.5 19 5M8.5 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
  store: 'M4 10.5V20h16v-9.5M3 10.5 4.8 4h14.4L21 10.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0ZM10 20v-5.5h4V20',
  filter: 'M4 6h16M7 12h10m-7 6h4',
  shirt: 'M8.5 3 5 5.4l1.7 3.2L8.5 7.4V21h7V7.4l1.8 1.2L19 5.4 15.5 3h-1.8a1.8 1.8 0 0 1-3.4 0Z',
  wheelchair: 'M12 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM10 7v6h5l2.4 5M10 13H7l-1.4 3.4M18.2 17.6a5.6 5.6 0 1 1-8.8-4.6',
  prosthesis: 'M9 3.4h6l-.6 5.4h-4.8ZM12 12.8v4.8M14 10.8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14.6 20a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0Z',
  spoon: 'M18.5 7.9c0 2.4-2 4.4-4.5 4.4S9.5 10.3 9.5 7.9 11.5 3.5 14 3.5s4.5 2 4.5 4.4ZM11.4 11.6 5.5 20.4',
  shoe: 'M3 17.4c0-2.6 1.3-3.9 3.7-4.4l5.2-1.1 2.4-3.6c.6-.9 1.9-.5 1.9.5v2.7l2.7.6c1.6.4 2.6 1.2 2.6 2.6v2.7H3Zm0 0V20h18v-2.6',
  cup: 'M4 6.5h11v8.8a4.2 4.2 0 0 1-4.2 4.2H8.2A4.2 4.2 0 0 1 4 15.3Zm11 2h2.6a2.6 2.6 0 0 1 0 5.2H15M3 21.5h13',
}

interface IconProps {
  name: IconName
  /** Decorativo por defecto: el significado va en el texto que lo acompaña. */
  className?: string
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5 shrink-0', className)}
    >
      <path d={paths[name]} />
    </svg>
  )
}
