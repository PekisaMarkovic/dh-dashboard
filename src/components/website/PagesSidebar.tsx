import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

const Dot = ({ label }: { label: string }) => <span aria-label={label} className="ml-auto inline-block h-2 w-2 shrink-0 rounded-full bg-orange" />

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

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

  const itemClass = (isActive: boolean) =>
    `font-poppins flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm ${isActive ? 'bg-green-transparent text-green' : 'text-black hover:bg-light-grey-transparent'}`

  return (
    <aside className="flex flex-col rounded-sm bg-light-grey-transparent p-3">
      <button type="button" onClick={onSiteSettings} className={itemClass(activeSite === 'general')}>
        <Icon d={SETTINGS_ICON} />
        <span>{t('website:pages.siteSettings')}</span>
        {website.completeness.missing.some((key) => key.startsWith('general.')) && <Dot label={t('website:content.incomplete')} />}
      </button>
      <button type="button" onClick={onContacts} className={itemClass(activeSite === 'contacts')}>
        <Icon d={MESSAGES_ICON} />
        <span>{t('website:tabs.contacts')}</span>
      </button>

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
          <button key={page.pageId} type="button" onClick={() => onPage(page.pageId)} className={itemClass(page.pageId === activePageId)}>
            <Icon d={page.slug === '' ? HOME_ICON : PAGE_ICON} />
            <span className="truncate">{page.title}</span>
            {page.status === 'draft' && <span className="text-xs text-dark-grey">({t('website:pages.draft')})</span>}
            {isPageMissing(website, page) && <Dot label={t('website:content.incomplete')} />}
          </button>
        ))}
      </nav>

    </aside>
  )
}

export default PagesSidebar
