export type BadgeTone = 'green' | 'orange' | 'red' | 'solid-green'

const TONES: Record<BadgeTone, string> = {
  green: 'bg-green-transparent text-green',
  orange: 'bg-orange-transparent text-dark-orange',
  red: 'bg-red-transparent text-red',
  'solid-green': 'bg-green text-white',
}

// a small rounded label: a status (published / draft) or a count
const Badge = ({ text, tone }: { text: string; tone: BadgeTone }) => (
  <span className={`font-poppins inline-flex items-center whitespace-nowrap rounded-xl px-3 py-1 text-xs font-medium ${TONES[tone]}`}>{text}</span>
)

export default Badge
