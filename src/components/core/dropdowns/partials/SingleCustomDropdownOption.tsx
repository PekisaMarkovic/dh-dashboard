import { Link } from 'react-router-dom'
import { CustomDropdown, Color } from '@/src/interfaces'

const SingleCustomDropdownOption = ({ content, textColor = 'black' }: CustomDropdown) => {
  const checkColor = (textColor: Color) => {
    switch (textColor) {
      case 'red':
        return `${textColor} bg-light-grey-transparent`

      default:
        return textColor
    }
  }

  switch (content.type) {
    case 'link':
      return (
        <Link
          className={`block font-poppins text-${checkColor(textColor)} py-2 px-2.5 cursor-pointer`}
          to={content.href}
          download={content.download}
          target={content.target}
        >
          {content.text}
        </Link>
      )

    case 'button':
      return (
        <p className={`font-poppins text-${checkColor(textColor)} py-2 px-2.5  cursor-pointer`} onClick={content.onClick}>
          {content.text}
        </p>
      )
  }
}

export default SingleCustomDropdownOption
