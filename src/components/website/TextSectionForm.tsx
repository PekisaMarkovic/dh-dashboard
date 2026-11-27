import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import RichTextEditor from '@/src/components/core/input/RichTextEditor'
import DataSection from '@/src/components/section/DataSection'
import { useWebsiteAction } from '@/src/hooks/use-save-website'
import { IWebsiteSection } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'

// the same as the api (RICH_TEXT_MAX)
const MAX_HTML = 20000

// the text a person sees, without the tags
const visibleText = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim()

// "Tekst": free text with headings, bold, lists and links, written or pasted in the rich text editor
const TextSectionForm = ({ section }: { section: IWebsiteSection }) => {
  const { t } = useTranslation(['website'])
  const run = useWebsiteAction()
  const { updateSection } = useWebsiteService()
  const [html, setHtml] = useState(section.content.html ?? '')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!visibleText(html)) return setError(t('website:text.required'))
    if (html.length > MAX_HTML) return setError(t('website:text.tooLong'))

    setError('')
    setIsSaving(true)
    await run(() => updateSection(section.sectionId, { html }))
    setIsSaving(false)
  }

  return (
    <DataSection title={t('website:types.text')} subtitle={t('website:typeHints.text')}>
      <RichTextEditor isRequired label={t('website:text.label')} value={section.content.html ?? ''} onChange={setHtml} error={error} />
      <div className="mt-5 flex justify-center">
        <MainButton text={t('website:save')} variant="contained" size="medium" htmlType="button" disabled={isSaving} onClick={() => void handleSave()} />
      </div>
    </DataSection>
  )
}

export default TextSectionForm
