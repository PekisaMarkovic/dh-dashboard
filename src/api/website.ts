const base = 'website'

const getWebsite = () => base
const patchWebsite = () => base
const image = (slot: string) => `${base}/images/${slot}`
const getContacts = () => `${base}/contacts`
const publish = () => `${base}/publish`
const unpublish = () => `${base}/unpublish`

const WebsiteApis = { getWebsite, patchWebsite, image, getContacts, publish, unpublish }

export default WebsiteApis
