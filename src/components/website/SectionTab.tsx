import { Fragment, ReactNode, useMemo } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import Checkbox from '@/src/components/core/checkbox/Checkbox'
import InputText from '@/src/components/core/input/InputText'
import InputTextarea from '@/src/components/core/input/InputTextarea'
import DataSection from '@/src/components/section/DataSection'

export type SectionField = {
  name: string
  // the translation key in `website`, e.g. fields.title
  label: string
  isTextarea?: boolean
  // the translation key of the example shown in the empty input
  placeholder?: string
  // the most characters, the counter under a text area counts down to it
  maxChar?: number
}

type Props = {
  title: string
  subtitle: string
  fields: SectionField[]
  // the saved texts (and the saved switch)
  saved: Record<string, string | boolean | null | undefined> | undefined
  // saves the texts of the form by their names, and the switch
  onSave: (values: Record<string, string | boolean>) => Promise<unknown>
  // a switch (on by default) that shows its fields; off, they are hidden, not required and not sent (e.g. "show the button")
  toggle?: { name: string; label: string; fields: string[] }
  validation: unknown
  // more content under the fields (e.g. the picked drinks)
  children?: ReactNode
}

/**
 * A form of texts of the site (a section, the SEO of a page). Every text is required.
 * A picture is its own field under it (it is saved when it is picked).
 */
const SectionTab = ({ title, subtitle, fields, saved, onSave, validation, toggle, children }: Props) => {
  const { t } = useTranslation(['website'])
  const isSavedOn = !toggle || saved?.[toggle.name] !== false
  const texts = useMemo(() => Object.fromEntries(fields.map(({ name }) => [name, String(saved?.[name] ?? '')])), [fields, saved])
  const values = useMemo(() => ({ ...texts, ...(toggle && { [toggle.name]: { checked: isSavedOn } }) }), [texts, toggle, isSavedOn])
  const methods = useForm<FieldValues>({ resolver: validation as Resolver<FieldValues>, values })
  const isOn = useWatch({ control: methods.control, name: toggle ? `${toggle.name}.checked` : '' }) ?? isSavedOn
  const isShown = (name: string) => !toggle || isOn || !toggle.fields.includes(name)

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await onSave({
      ...Object.fromEntries(fields.filter(({ name }) => isShown(name)).map(({ name }) => [name, data[name] ?? ''])),
      ...(toggle && { [toggle.name]: !!isOn }),
    })
  }

  return (
    <DataSection title={title} subtitle={subtitle}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
          {fields.map(({ name, label, isTextarea, placeholder, maxChar }) => (
            <Fragment key={name}>
              {/* the switch is right above the fields it shows (e.g. "show the button" above the text of the button) */}
              {toggle?.fields[0] === name && <Checkbox name={toggle.name} initValue={isSavedOn} label={t(toggle.label)} />}
              {isShown(name) &&
                (isTextarea ? (
                  <InputTextarea isRequired name={name} initValue={texts[name]} label={t(label)} placeholder={placeholder && t(placeholder)} rows={4} maxChar={maxChar} />
                ) : (
                  <InputText isRequired name={name} initValue={texts[name]} label={t(label)} placeholder={placeholder && t(placeholder)} />
                ))}
            </Fragment>
          ))}
          {children}
          <div className="flex justify-center">
            <MainButton text={t('website:save')} variant="contained" size="medium" htmlType="submit" disabled={methods.formState.isSubmitting} />
          </div>
        </form>
      </FormProvider>
    </DataSection>
  )
}

export default SectionTab
