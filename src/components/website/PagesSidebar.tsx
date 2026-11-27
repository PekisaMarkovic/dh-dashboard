import { useState } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import IconButton from '@/src/components/core/buttons/IconButton'
import MainButton from '@/src/components/core/buttons/MainButton'
import { ICONS } from '@/src/components/core/icons/paths'
import InputText from '@/src/components/core/input/InputText'
import Paragraph from '@/src/components/core/typography/Paragraph'
import SidebarItem from '@/src/components/website/SidebarItem'
import { useWebsiteAction } from '@/src/hooks/use-save-website'
import { IWebsite } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { isPageMissing } from '@/src/utils/website'
import { NEW_PAGE_VALIDATION } from '@/src/validations/website/website'

type Props = {
  website: IWebsite
  // null when the settings of the site or the messages are open
  activePageId: number | null
  // which of the two is open
  activeSite: 'general' | 'contacts' | null
  onPage: (pageId: number) => void
  onSiteSettings: () => void
  onContacts: () => void
}

const HOME_ICON = 'M3 11 12 3l9 8M5 9v12h14V9'
const PAGE_ICON = 'M6 3h9l4 4v14H6zM9 12h6M9 16h6'
const MESSAGES_ICON = 'M4 5h16v11H8l-4 4z'
const SETTINGS_ICON = 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1'

/** The settings of the whole site and the messages on top, then the pages of the site (a dot: something on it is missing) and a new page */
const PagesSidebar = ({ website, activePageId, activeSite, onPage, onSiteSettings, onContacts }: Props) => {
  const { t } = useTranslation(['website'])
  const run = useWebsiteAction()
  const { createPage } = useWebsiteService()
  const [isAdding, setIsAdding] = useState(false)
  const methods = useForm<FieldValues>({ resolver: NEW_PAGE_VALIDATION as unknown as Resolver<FieldValues>, defaultValues: { title: '' } })

  const handleAdd: SubmitHandler<FieldValues> = async ({ title }) => {
    let created: number | undefined
    const isDone = await run(async () => {
      const site = await createPage(String(title).trim())
      // the new page is the one with the highest id
      created = Math.max(...site.pages.map((page) => page.pageId))
    }, t('website:pages.created'))

    if (isDone && created) {
      setIsAdding(false)
      methods.reset({ title: '' })
      onPage(created)
    }
  }

  return (
    <aside className="flex flex-col rounded-sm bg-light-grey-transparent p-3">
      <SidebarItem
        icon={SETTINGS_ICON}
        label={t('website:pages.siteSettings')}
        isActive={activeSite === 'general'}
        onClick={onSiteSettings}
        hasWarning={website.completeness.missing.some((key) => key.startsWith('general.'))}
      />
      <SidebarItem icon={MESSAGES_ICON} label={t('website:tabs.contacts')} isActive={activeSite === 'contacts'} onClick={onContacts} />

      <div className="my-3 border-t-1 border-solid border-light-grey-alt" />

      <div className="flex items-center justify-between px-1 pb-2">
        <Paragraph text={t('website:pages.title')} color="dark-grey" weight="medium" textTransform="uppercase" />
        <IconButton label={t('website:pages.add')} icon={ICONS.plus} onClick={() => setIsAdding((value) => !value)} />
      </div>

      {isAdding && (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleAdd)} className="mb-3 flex flex-col gap-3 px-1 pt-2">
            <InputText isRequired name="title" label={t('website:pages.titlePlh')} placeholder={t('website:page.titlePlh')} />
            <MainButton text={t('website:pages.create')} variant="contained" size="full" htmlType="submit" disabled={methods.formState.isSubmitting} />
          </form>
        </FormProvider>
      )}

      <nav aria-label={t('website:pages.title')} className="flex flex-col gap-1">
        {website.pages.map((page) => (
          <SidebarItem
            key={page.pageId}
            icon={page.slug === '' ? HOME_ICON : PAGE_ICON}
            label={page.title}
            isActive={page.pageId === activePageId}
            onClick={() => onPage(page.pageId)}
            note={page.status === 'draft' ? t('website:pages.draft') : undefined}
            hasWarning={isPageMissing(website, page)}
          />
        ))}
      </nav>

    </aside>
  )
}

export default PagesSidebar
