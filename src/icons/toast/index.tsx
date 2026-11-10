import ErrorIcon from '@/src/icons/toast/ErrorIcon'
import QuestionIcon from '@/src/icons/toast/QuestionIcon'
import SuccessIcon from '@/src/icons/toast/SuccessIcon'
import WarrningIcon from '@/src/icons/toast/WarrningIcon'

interface Props extends React.SVGProps<SVGSVGElement> {
  type: 'Error' | 'Success' | 'Question' | 'Warrning'
}

const ToastIcon = ({ type, ...rest }: Props) => {
  switch (type) {
    case 'Error':
      return <ErrorIcon {...rest} />
    case 'Success':
      return <SuccessIcon {...rest} />
    case 'Question':
      return <QuestionIcon {...rest} />
    case 'Warrning':
      return <WarrningIcon {...rest} />

    default:
      return null
  }
}

export default ToastIcon
