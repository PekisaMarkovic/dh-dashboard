import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SidebarItem from '@/src/components/website/SidebarItem'
import { useWebsiteAction } from '@/src/hooks/use-save-website'
import { IWebsite } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { isPageMissing } from '@/src/utils/website'

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
  const [title, setTitle] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault()

    if (!title.trim()) return

    setIsBusy(true)

    let created: number | undefined
    const isDone = await run(async () => {
      const site = await createPage(title.trim())
      // the new page is the one with the highest id
      created = Math.max(...site.pages.map((page) => page.pageId))
    }, t('website:pages.created'))

    setIsBusy(false)

    if (isDone && created) {
      setIsAdding(false)
      setTitle('')
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
        <span className="font-poppins text-xs font-medium uppercase tracking-wide text-dark-grey">{t('website:pages.title')}</span>
        <button
          type="button"
          onClick={() => setIsAdding((value) => !value)}
          aria-label={t('website:pages.add')}
          title={t('website:pages.add')}
          className="font-poppins flex h-7 w-7 items-center justify-center rounded-md text-lg text-black hover:bg-white"
        >
          +
        </button>
      </div>

      {isAdding && (
        <form onSubmit={(event) => void handleAdd(event)} className="mb-2 flex flex-col gap-2 px-1">
          <input
            autoFocus
            value={title}
            maxLength={100}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t('website:pages.titlePlh')}
            aria-label={t('website:pages.titlePlh')}
            className="font-poppins h-10 w-full rounded-xs-plus border-1 border-solid border-grey bg-white px-3 text-sm text-black focus:border-green focus:outline-none"
          />
          <button
            type="submit"
            disabled={isBusy || !title.trim()}
            className="font-poppins h-9 rounded-md bg-green text-sm text-white disabled:opacity-50"
          >
            {t('website:pages.create')}
          </button>
        </form>
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
