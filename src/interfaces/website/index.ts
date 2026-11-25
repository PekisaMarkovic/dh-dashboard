export type WebsiteImageSlot = 'logo' | 'hero' | 'story' | 'promo' | 'og'

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

// the texts of the sections, a missing text means the site uses its own default text
export interface IWebsiteSections {
  hero?: { title?: string; subtitle?: string; text?: string; buttonText?: string }
  featured?: { title?: string; buttonText?: string; drinkIds?: number[] }
  story?: { title?: string; paragraph1?: string; paragraph2?: string; buttonText?: string }
  promo?: { title?: string; text?: string; buttonText?: string }
  // what Google and the social networks show: the title and the description of the site and of the menu page
  seo?: { title?: string; description?: string; menuTitle?: string; menuDescription?: string }
}

export type WebsiteStatus = 'draft' | 'published'

// what is still missing before the site can be published, every item is <section>.<field> (e.g. general.logo, hero.image)
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
  sections: IWebsiteSections
  logoImage: IWebsiteImage | null
  heroImage: IWebsiteImage | null
  storyImage: IWebsiteImage | null
  promoImage: IWebsiteImage | null
  // the picture shown when the site is shared
  ogImage: IWebsiteImage | null
  // the names of the picked recommended drinks, in the picked order
  featuredDrinks: { drinkId: number; name: string }[]
}

// what is sent to change the site, an empty text removes the value
export interface IWebsiteUpdate {
  name?: string
  city?: string
  address?: string
  phone?: string
  instagram?: string
  workingHours?: string
  hero?: IWebsiteSections['hero']
  featured?: IWebsiteSections['featured']
  story?: IWebsiteSections['story']
  promo?: IWebsiteSections['promo']
  seo?: IWebsiteSections['seo']
}

// a message from the contact form of the site
export interface IWebsiteContact {
  contactId: number
  name: string
  phone: string
  email: string | null
  message: string | null
  createdAt: string
}
