import axios from 'axios'
import { useMemo } from 'react'
import WebsiteApis from '@/src/api/website'
import { useApi } from '@/src/hooks/use-api'
import { IPageUpdate, ISectionUpdate, IWebsite, IWebsiteContact, IWebsiteUpdate, PageParams, Paginated, SectionType } from '@/src/interfaces'

export const useWebsiteService = () => {
  const api = useApi()

  return useMemo(() => {
    // null when the company has no website (the api says 404), so a company without one is not an error
    const getWebsite = async (): Promise<IWebsite | null> => {
      try {
        const { data } = await api.get<IWebsite>(WebsiteApis.getWebsite())

        return data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) return null

        throw error
      }
    }

    const updateWebsite = async (body: IWebsiteUpdate) => {
      const { data } = await api.patch<IWebsite>(WebsiteApis.patchWebsite(), body)

      return data
    }

    // the api makes a WebP of any jpg / png / webp and replaces the old picture (path: 'logo', 'sections/<id>/image', 'pages/<id>/seo/image')
    const uploadImage = async (path: string, file: File) => {
      const body = new FormData()
      body.append('file', file)
      // the api sends json by default, which would turn the form data into json and lose the file
      const { data } = await api.put<IWebsite>(WebsiteApis.image(path), body, { headers: { 'Content-Type': 'multipart/form-data' } })

      return data
    }

    const deleteImage = async (path: string) => {
      const { data } = await api.delete<IWebsite>(WebsiteApis.image(path))

      return data
    }

    // only a complete site can be published (the api says what is missing)
    const publishWebsite = async () => {
      const { data } = await api.post<IWebsite>(WebsiteApis.publish())

      return data
    }

    const unpublishWebsite = async () => {
      const { data } = await api.post<IWebsite>(WebsiteApis.unpublish())

      return data
    }

    const getContacts = async (params: PageParams) => {
      const { data } = await api.get<Paginated<IWebsiteContact>>(WebsiteApis.getContacts(), { params })

      return data
    }

    // a new page is a draft, its address is made from the title
    const createPage = async (title: string) => {
      const { data } = await api.post<IWebsite>(WebsiteApis.pages(), { title })

      return data
    }

    const updatePage = async (pageId: number, body: IPageUpdate) => {
      const { data } = await api.patch<IWebsite>(WebsiteApis.page(pageId), body)

      return data
    }

    const deletePage = async (pageId: number) => {
      const { data } = await api.delete<IWebsite>(WebsiteApis.page(pageId))

      return data
    }

    // all the sections of the page in order, a section left out is taken off the page
    const setPageSections = async (pageId: number, sections: { sectionId: number; isVisible: boolean }[]) => {
      const { data } = await api.put<IWebsite>(WebsiteApis.pageSections(pageId), { sections })

      return data
    }

    // a new empty section at the end of the page
    const createSection = async (pageId: number, type: SectionType) => {
      const { data } = await api.post<IWebsite>(WebsiteApis.pageSections(pageId), { type })

      return data
    }

    const updateSection = async (sectionId: number, body: ISectionUpdate) => {
      const { data } = await api.patch<IWebsite>(WebsiteApis.section(sectionId), body)

      return data
    }

    // the section is deleted from every page it is on
    const deleteSection = async (sectionId: number) => {
      const { data } = await api.delete<IWebsite>(WebsiteApis.section(sectionId))

      return data
    }

    return {
      getWebsite,
      updateWebsite,
      uploadImage,
      deleteImage,
      publishWebsite,
      unpublishWebsite,
      getContacts,
      createPage,
      updatePage,
      deletePage,
      setPageSections,
      createSection,
      updateSection,
      deleteSection,
    }
  }, [api])
}
