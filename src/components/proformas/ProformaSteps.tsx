import ProformaStep from '@/src/components/proformas/ProformaStep'

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
  return (
    <ol className="flex items-center gap-x-3 w-full mb-5">
      {STEPS.map(({ number, label }, index) => (
        <ProformaStep key={number} number={number} label={label} isDone={number < step} isCurrent={number === step} hasNext={index < STEPS.length - 1} />
      ))}
    </ol>
  )
}

export default ProformaSteps
