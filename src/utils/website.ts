import { TFunction } from 'i18next'
import { IWebsite, IWebsitePage, IWebsiteSection } from '@/src/interfaces'

// the tabs of a page in the editor
export const PAGE_TABS = ['content', 'seo', 'settings'] as const
export type PageTab = (typeof PAGE_TABS)[number]

// the most pages in the main menu of the site (the same as the api, MAX_MENU_PAGES)
export const MAX_MENU_PAGES = 5

// the home page and the drinks menu: every site has them, they keep their address and stay published (the same as the api)
export const isSystemPage = (page: IWebsitePage) => page.slug === '' || page.slug === 'karta-pica'

// what is missing that starts with this prefix, e.g. `section.7.`
export const missingOf = (website: IWebsite, prefix: string) => website.completeness.missing.filter((key) => key.startsWith(prefix))

export const isSectionMissing = (website: IWebsite, sectionId: number) => missingOf(website, `section.${sectionId}.`).length > 0

// something is missing on the page: its SEO or one of its sections
export const isPageMissing = (website: IWebsite, page: IWebsitePage) =>
  missingOf(website, `page.${page.pageId}.`).length > 0 || page.sections.some(({ sectionId }) => isSectionMissing(website, sectionId))

// the pages a section is on
export const pagesOfSection = (website: IWebsite, sectionId: number) =>
  website.pages.filter((page) => page.sections.some((item) => item.sectionId === sectionId))

// how a section is called in the dashboard: its title, its kind until it has one
export const sectionLabel = (section: IWebsiteSection, t: TFunction) => {
  // a text section has no title: the start of its text
  const start = section.content.html?.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40)

  return section.content.title?.trim() || start || t(`website:types.${section.type}`)
}
