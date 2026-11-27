export type BadgeTone = 'green' | 'orange' | 'red' | 'blue' | 'grey' | 'solid-green'

const TONES: Record<BadgeTone, string> = {
  green: 'bg-green-transparent text-green',
  orange: 'bg-orange-transparent text-dark-orange',
  red: 'bg-red-transparent text-red',
  blue: 'bg-blue-transparent text-blue',
  grey: 'bg-light-grey-transparent text-grey',
  'solid-green': 'bg-green text-white',
}

// a small label with slightly rounded corners: a status (of a page, an order, a proforma, an import, an invitation), a category or a count.
// Every status and category of the dashboard looks the same
const Badge = ({ text, tone }: { text: string; tone: BadgeTone }) => (
  <span className={`font-poppins inline-flex h-6 items-center whitespace-nowrap rounded-md px-2 text-xs font-medium leading-none ${TONES[tone]}`}>{text}</span>
)

export default Badge
