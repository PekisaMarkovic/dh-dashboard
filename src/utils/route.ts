export const checkIsLinkActiv = (pathname: string, link: string) => {
  return pathname.startsWith(link)
}
