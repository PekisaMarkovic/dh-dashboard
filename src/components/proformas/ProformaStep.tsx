import { useTranslation } from 'react-i18next'

type Props = {
  number: number
  // the translation key of the name of the step
  label: string
  isDone: boolean
  isCurrent: boolean
  // not the last step: a line to the next one fills the width
  hasNext: boolean
}

// one step of making a proforma: a check when it is done, green while it is the current one
const ProformaStep = ({ number, label, isDone, isCurrent, hasNext }: Props) => {
  const { t } = useTranslation(['proforma'])

  return (
    <li className={`flex items-center gap-x-3 ${hasNext ? 'flex-1' : ''}`} aria-current={isCurrent ? 'step' : undefined}>
      <span
        className={`flex items-center justify-center h-7 w-7 rounded-full font-poppins text-sm ${
          isDone || isCurrent ? 'bg-green text-white' : 'bg-light-grey-in-active text-grey-secondary'
        }`}
      >
        {isDone ? '✓' : number}
      </span>
      <span className={`font-poppins text-sm ${isCurrent ? 'text-black font-medium whitespace-nowrap' : 'text-dark-grey'}`}>{t(label)}</span>
      {hasNext && <span className={`h-px flex-1 ${isDone ? 'bg-green' : 'bg-light-grey-alt'}`} />}
    </li>
  )
}

export default ProformaStep
