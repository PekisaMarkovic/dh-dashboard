import { ReactNode, useMemo } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
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
  // the saved texts
  saved: Record<string, string | null | undefined> | undefined
  // saves the texts of the form, by their names
  onSave: (values: Record<string, string>) => Promise<unknown>
  validation: unknown
  // more content under the fields (e.g. the picked drinks)
  children?: ReactNode
}

/**
 * A form of texts of the site (a section, the SEO of a page). Every text is required.
 * A picture is its own field under it (it is saved when it is picked).
 */
const SectionTab = ({ title, subtitle, fields, saved, onSave, validation, children }: Props) => {
  const { t } = useTranslation(['website'])
  const values = useMemo(() => Object.fromEntries(fields.map(({ name }) => [name, saved?.[name] ?? ''])), [fields, saved])
  const methods = useForm<FieldValues>({ resolver: validation as Resolver<FieldValues>, values })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await onSave(Object.fromEntries(fields.map(({ name }) => [name, data[name] ?? ''])))
  }

  return (
    <DataSection title={title} subtitle={subtitle}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
          {fields.map(({ name, label, isTextarea, placeholder, maxChar }) =>
            isTextarea ? (
              <InputTextarea key={name} isRequired name={name} initValue={values[name]} label={t(label)} placeholder={placeholder && t(placeholder)} rows={4} maxChar={maxChar} />
            ) : (
              <InputText key={name} isRequired name={name} initValue={values[name]} label={t(label)} placeholder={placeholder && t(placeholder)} />
            )
          )}
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
