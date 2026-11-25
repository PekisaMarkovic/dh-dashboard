import axios from 'axios'
import { useMemo } from 'react'
import WebsiteApis from '@/src/api/website'
import { useApi } from '@/src/hooks/use-api'
import { IWebsite, IWebsiteContact, IWebsiteUpdate, PageParams, Paginated, WebsiteImageSlot } from '@/src/interfaces'

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

    // the api makes a WebP of any jpg / png / webp and replaces the old picture of the slot
    const uploadImage = async (slot: WebsiteImageSlot, file: File) => {
      const body = new FormData()
      body.append('file', file)
      // the api sends json by default, which would turn the form data into json and lose the file
      const { data } = await api.put<IWebsite>(WebsiteApis.image(slot), body, { headers: { 'Content-Type': 'multipart/form-data' } })

      return data
    }

    const deleteImage = async (slot: WebsiteImageSlot) => {
      const { data } = await api.delete<IWebsite>(WebsiteApis.image(slot))

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

    return { getWebsite, updateWebsite, uploadImage, deleteImage, publishWebsite, unpublishWebsite, getContacts }
  }, [api])
}
