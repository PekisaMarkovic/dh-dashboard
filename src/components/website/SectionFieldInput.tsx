import { useTranslation } from 'react-i18next'
import InputText from '@/src/components/core/input/InputText'
import InputTextarea from '@/src/components/core/input/InputTextarea'
import { SectionField } from '@/src/components/website/SectionTab'

// one required text of a section form: a text area for the longer texts, else an input
const SectionFieldInput = ({ field, initValue }: { field: SectionField; initValue: string }) => {
  const { t } = useTranslation(['website'])
  const { name, label, isTextarea, placeholder, maxChar } = field

  return isTextarea ? (
    <InputTextarea isRequired name={name} initValue={initValue} label={t(label)} placeholder={placeholder && t(placeholder)} rows={4} maxChar={maxChar} />
  ) : (
    <InputText isRequired name={name} initValue={initValue} label={t(label)} placeholder={placeholder && t(placeholder)} />
  )
}

export default SectionFieldInput
