import { ReactNode, useMemo } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import InputTextarea from '@/src/components/core/input/InputTextarea'
import DataSection from '@/src/components/section/DataSection'
import { useSaveWebsite } from '@/src/hooks/use-save-website'
import { IWebsiteUpdate } from '@/src/interfaces'

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
  // the saved texts of the section
  saved: Record<string, string | undefined> | undefined
  // which part of the body the texts go into, e.g. 'hero'
  section: 'hero' | 'story' | 'promo' | 'seo'
  validation: unknown
  // more content under the fields (e.g. the picked drinks)
  children?: ReactNode
}

/**
 * The form of one section of the site: its texts. A text that is left empty is removed, then the site uses its default text.
 * The picture of the section is its own field under it (it is saved when it is picked).
 */
const SectionTab = ({ title, subtitle, fields, saved, section, validation, children }: Props) => {
  const { t } = useTranslation(['website'])
  const save = useSaveWebsite()
  const values = useMemo(() => Object.fromEntries(fields.map(({ name }) => [name, saved?.[name] ?? ''])), [fields, saved])
  const methods = useForm<FieldValues>({ resolver: validation as Resolver<FieldValues>, values })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const body = { [section]: Object.fromEntries(fields.map(({ name }) => [name, data[name] ?? ''])) } as IWebsiteUpdate

    await save(body)
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
