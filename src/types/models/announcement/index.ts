import { Asset, Entry } from "contentful"

/**
 * in Contentful
 */
export type LinkContentModel = {
  title?: string
  url: string
}

/**
 * in Contentful
 */
export type AnnouncementContentModel = {
  title: string
  publishedAt: string
  text: string
  files?: Asset[]
  links?: Array<Entry<LinkContentModel>>
}

export type Announcement = {
  id: string
  date: string
  title: string
  text: string
  links: {
    url: string
    label: string | null
  }[]
}
