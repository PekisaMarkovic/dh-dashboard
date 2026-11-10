import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enGeneral from './en/general.json'
import enLogIn from './en/log-in.json'
import enErrors from './en/errors.json'
import enStatic from './en/static.json'
import enWarehouses from './en/warehouses.json'
import enCompany from './en/company.json'
import enDrinks from './en/drinks.json'
import enProforma from './en/proforma.json'
import profile from './en/user/profile.json'

import srGeneral from './sr/general.json'
import srLogIn from './sr/log-in.json'
import srErrors from './sr/errors.json'
import srStatic from './sr/static.json'
import srWarehouses from './sr/warehouses.json'
import srDrinks from './sr/drinks.json'
import srCompany from './sr/company.json'
import srProforma from './sr/proforma.json'
import srProfile from './sr/user/profile.json'
import { getStoredLanguage } from '@/src/utils/language'
import { setDateLanguage } from '@/src/utils/date'

export const resources = {
  en: {
    g: enGeneral,
    'log-in': enLogIn,
    static: enStatic,
    er: enErrors,
    user: profile,
    warehouse: enWarehouses,
    drink: enDrinks,
    company: enCompany,
    proforma: enProforma,
  },
  sr: {
    g: srGeneral,
    'log-in': srLogIn,
    static: srStatic,
    er: srErrors,
    user: srProfile,
    warehouse: srWarehouses,
    drink: srDrinks,
    company: srCompany,
    proforma: srProforma,
  },
} as const

setDateLanguage(getStoredLanguage())

i18n.use(initReactI18next).init({
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  defaultNS: 'g',
  resources,
  interpolation: { escapeValue: false },
})
