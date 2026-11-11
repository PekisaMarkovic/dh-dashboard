import { useTranslation } from 'react-i18next'

type Props = {
  // 1 = pick the drinks, 2 = review
  step: 1 | 2
}

const STEPS = [
  { number: 1, label: 'proforma:steps.pick' },
  { number: 2, label: 'proforma:steps.review' },
] as const

// the two steps of making a proforma: the finished step has a check, the current one is green, the lines between the steps fill the width
const ProformaSteps = ({ step }: Props) => {
  const { t } = useTranslation(['proforma'])

  return (
    <ol className="flex items-center gap-x-3 w-full mb-5">
      {STEPS.map(({ number, label }, index) => {
        const isDone = number < step
        const isCurrent = number === step

        return (
          <li
            key={number}
            className={`flex items-center gap-x-3 ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span
              className={`flex items-center justify-center h-7 w-7 rounded-full font-poppins text-sm ${
                isDone || isCurrent ? 'bg-green text-white' : 'bg-light-grey-in-active text-grey-secondary'
              }`}
            >
              {isDone ? '✓' : number}
            </span>
            <span className={`font-poppins text-sm ${isCurrent ? 'text-black font-medium whitespace-nowrap' : 'text-dark-grey'}`}>{t(label)}</span>
            {index < STEPS.length - 1 && <span className={`h-px flex-1 ${isDone ? 'bg-green' : 'bg-light-grey-alt'}`} />}
          </li>
        )
      })}
    </ol>
  )
}

export default ProformaSteps
