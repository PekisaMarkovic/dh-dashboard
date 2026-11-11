import SerbiaFlag from '@/src/icons/flags/SerbiaFlag'
import { Language } from '@/src/utils/language'

type Props = {
  language: Language
  className?: string
}

/**
 * The flag of a language: the United Kingdom for English, Serbia for Serbian.
 * Drawn here (not emoji), so it looks the same on every system, Windows shows letters instead of emoji flags.
 */
const FlagIcon = ({ language, className }: Props) => {
  if (language === 'sr') {
    return <SerbiaFlag className={className} />
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="9 0 42 30" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <clipPath id="flag-en-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="flag-en-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#flag-en-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#flag-en-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

export default FlagIcon
