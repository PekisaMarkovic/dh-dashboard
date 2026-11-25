import { NavigationIconType } from '@/src/icons/navigation'
import { ROUTE_NAMES } from '@/src/constatns/routes'

interface IMenuLink {
  text: string
  icon: NavigationIconType
  link: string
  adminOnly?: boolean
  // shown only when the company has a white label website (the clients table has a row for it)
  requiresWebsite?: boolean
}

// most used first: proforma, drinks, customers, then the warehouses that are set up once
export const LEFT_SIDE_MENU_LINKS: IMenuLink[] = [
  { text: 'proformas', icon: 'Proforma', link: ROUTE_NAMES.proformas },
  { text: 'drinks', icon: 'Drink', link: ROUTE_NAMES.drinks },
  { text: 'purchaseImport', icon: 'Import', link: ROUTE_NAMES.purchaseImport, adminOnly: true },
  { text: 'customers', icon: 'Customer', link: ROUTE_NAMES.customers },
  { text: 'warehouses', icon: 'Warehouse', link: ROUTE_NAMES.warehouses },
  { text: 'company', icon: 'Company', link: ROUTE_NAMES.company, adminOnly: true },
  { text: 'website', icon: 'Website', link: ROUTE_NAMES.website, adminOnly: true, requiresWebsite: true },
]

export const TOP_MENU_LINKS_FOR_TRANSLATIONS = [...LEFT_SIDE_MENU_LINKS.map((e) => e.link), ROUTE_NAMES.profile]
