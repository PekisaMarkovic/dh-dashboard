import EmptyIcon from '@/public/images/general/empty-component.svg'
import Paragraph from '@/src/components/core/typography/Paragraph'
import MainButton from '@/src/components/core/buttons/MainButton'

type Props = {
  text: string
  button?: {
    handleOnClick: () => void
    text: string
  }
}

const EmptyComponent = ({ text, button }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6">
      <EmptyIcon />
      <Paragraph text={text} weight="light" color="grey" size="3xl" />
      {button && <MainButton text={button.text} variant="alternative" size="medium" onClick={() => button.handleOnClick()} />}
    </div>
  )
}

export default EmptyComponent
