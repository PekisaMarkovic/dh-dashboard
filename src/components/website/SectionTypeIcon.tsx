import { SectionType } from '@/src/interfaces'

// a line icon for every kind of section
const TYPE_ICONS: Record<SectionType, JSX.Element> = {
  hero: <path d="M3 5h18v14H3zM3 9h18" />,
  featured: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  story: <path d="M4 6h16M4 10h16M4 14h10M4 18h12" />,
  info: <path d="M3 11v2l13 5V6L3 11zM16 9h2a3 3 0 0 1 0 6h-2" />,
  text: <path d="M4 7V4h16v3M9 20h6M12 4v16" />,
}

const SectionTypeIcon = ({ type }: { type: SectionType }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-light-grey-transparent text-grey-secondary">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {TYPE_ICONS[type]}
    </svg>
  </span>
)

export default SectionTypeIcon
