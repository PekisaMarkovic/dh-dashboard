export interface IWebsiteImage {
  imageId: number
  // public address of the file (WebP)
  url: string
  mimeType: string
  // bytes
  size: number
  width: number
  height: number
  altText: string | null
}

export type SectionType = 'hero' | 'featured' | 'story' | 'info' | 'text'

// the texts of a section (only the ones of its type), a missing text means the site leaves it out
export interface ISectionContent {
  title?: string
  subtitle?: string
  text?: string
  paragraph1?: string
  paragraph2?: string
  buttonText?: string
  // a hero shows its button unless this is false
  showButton?: boolean
  // the picked recommended drinks, in this order (only the recommended drinks)
  drinkIds?: number[]
  // the HTML of a text section (from the rich text editor)
  html?: string
}

// a part of a page (hero, recommended drinks, story, info); the same section can be on more pages
export interface IWebsiteSection {
  sectionId: number
  type: SectionType
  // the name in the dashboard, not shown on the site
  name: string
  content: ISectionContent
  image: IWebsiteImage | null
  // the names and images of the picked recommended drinks, in the picked order
  drinks: { drinkId: number; name: string; imageUrl: string | null }[]
}

// a page of the site: its address ('' is the home page), its SEO and its sections in order
export interface IWebsitePage {
  pageId: number
  title: string
  slug: string
  // a draft page is not on the site
  status: WebsiteStatus
  // in the main menu of the site (at most 5), else in the footer
  isInMenu: boolean
  position: number
  seo: { title: string | null; description: string | null; image: IWebsiteImage | null }
  sections: { sectionId: number; position: number; isVisible: boolean }[]
}

export type WebsiteStatus = 'draft' | 'published'

// what is still missing before the site can be published: general.<field>, page.<pageId>.<seoTitle|seoDescription|seoImage>, section.<sectionId>.<field|image|drinks>
export interface IWebsiteCompleteness {
  isComplete: boolean
  missing: string[]
}

// the white label site of the company (the row of the clients table)
export interface IWebsite {
  // a draft shows a "coming soon" page, only a complete site can be published
  status: WebsiteStatus
  publishedAt: string | null
  completeness: IWebsiteCompleteness
  // the GUID, it is the ACCESS_KEY of the site
  clientId: string
  name: string
  city: string | null
  address: string | null
  phone: string | null
  instagram: string | null
  workingHours: string | null
  logoImage: IWebsiteImage | null
  // the pages in the order of the menu
  pages: IWebsitePage[]
  // every section of the site, also the ones on no page
  sections: IWebsiteSection[]
}

// what is sent to change the general info of the site
export interface IWebsiteUpdate {
  name?: string
  city?: string
  address?: string
  phone?: string
  instagram?: string
  workingHours?: string
}

export interface IPageUpdate {
  title?: string
  slug?: string
  status?: WebsiteStatus
  isInMenu?: boolean
  seo?: { title?: string; description?: string }
}

export type ISectionUpdate = ISectionContent & { name?: string }

// a message from the contact form of the site
export interface IWebsiteContact {
  contactId: number
  name: string
  phone: string
  email: string | null
  message: string | null
  createdAt: string
}
