import LineIcon from '@/src/components/core/icons/LineIcon'
import { SectionType } from '@/src/interfaces'

// a line icon for every kind of section
const TYPE_ICONS: Record<SectionType, string> = {
  hero: 'M3 5h18v14H3zM3 9h18',
  featured: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  story: 'M4 6h16M4 10h16M4 14h10M4 18h12',
  info: 'M3 11v2l13 5V6L3 11zM16 9h2a3 3 0 0 1 0 6h-2',
  text: 'M4 7V4h16v3M9 20h6M12 4v16',
}

const SectionTypeIcon = ({ type }: { type: SectionType }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-light-grey-transparent text-grey-secondary">
    <LineIcon d={TYPE_ICONS[type]} />
  </span>
)

export default SectionTypeIcon
