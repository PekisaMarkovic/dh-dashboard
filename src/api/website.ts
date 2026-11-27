const base = 'website'

const getWebsite = () => base
const patchWebsite = () => base
// a picture: 'logo', 'sections/<id>/image' or 'pages/<id>/seo/image'
const image = (path: string) => `${base}/${path}`
const getContacts = () => `${base}/contacts`
const publish = () => `${base}/publish`
const unpublish = () => `${base}/unpublish`
const pages = () => `${base}/pages`
const page = (pageId: number) => `${base}/pages/${pageId}`
const pageSections = (pageId: number) => `${base}/pages/${pageId}/sections`
const section = (sectionId: number) => `${base}/sections/${sectionId}`

const WebsiteApis = { getWebsite, patchWebsite, image, getContacts, publish, unpublish, pages, page, pageSections, section }

export default WebsiteApis
