// a small orange dot next to something where something is missing
const WarningDot = ({ label, className = '' }: { label: string; className?: string }) => (
  <span role="img" aria-label={label} title={label} className={`inline-block h-2 w-2 shrink-0 rounded-full bg-orange ${className}`} />
)

export default WarningDot
