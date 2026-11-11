const SECOND = 1000
const MINUTE = 60 * SECOND

// How long the cached data counts as fresh. Before that it is used as it is,
// after that it is shown right away and loaded again in the background.
export const STALE_TIMES = {
  // company, users, invitations, customers, warehouses
  rarelyChanges: 5 * MINUTE,
  proformas: 2 * MINUTE,
  // the drinks: every proforma changes the stock, other employees change it too
  stock: 30 * SECOND,
  // the items of a proforma never change
  proformaDetail: 10 * MINUTE,
}
