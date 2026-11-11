// The keys of the cached data. A key works as a prefix:
// invalidating QUERY_KEYS.drinks reloads every list of drinks, of every warehouse.
export const QUERY_KEYS = {
  company: ['company'] as const,
  companyUsers: ['company-users'] as const,
  invitations: ['invitations'] as const,
  warehouses: ['warehouses'] as const,
  drinks: ['drinks'] as const,
  customers: ['customers'] as const,
  proformas: ['proformas'] as const,
  proforma: ['proforma'] as const,
}
