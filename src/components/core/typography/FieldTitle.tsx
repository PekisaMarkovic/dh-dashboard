// the title above a field that is not a text input (a picture, the rich text editor, a list to pick from)
const FieldTitle = ({ text, isRequired }: { text: string; isRequired?: boolean }) => (
  <span className="font-poppins text-sm font-medium text-black">
    {text}
    {isRequired && <span className="text-red"> *</span>}
  </span>
)

export default FieldTitle
