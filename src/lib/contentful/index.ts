import { ContentfulClientApi, createClient, Entry } from "contentful"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

import { reportError } from "src/lib/errorTracking"
import type {
  Announcement,
  AnnouncementContentModel,
} from "src/types/models/announcement"

dayjs.extend(utc)
dayjs.extend(timezone)

const spaceId = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_TOKEN

export const getContentfulClient = (): ContentfulClientApi | "noToken" => {
  if (!spaceId || !accessToken) return "noToken"

  return createClient({
    space: spaceId,
    accessToken,
  })
}

const announcementEntryToAnnouncement = (
  item: Entry<AnnouncementContentModel>
): Announcement => ({
  id: item.sys.id,
  title: item.fields.title,
  text: item.fields.text,
  date: item.fields.publishedAt,
  links: [
    ...(item.fields.files ?? []).map((asset) => ({
      url: asset.fields.file.url,
      label: asset.fields.title ?? null,
    })),
    ...(item.fields.links ?? []).map((link) => ({
      url: link.fields.url,
      label: link.fields.title ?? null,
    })),
  ],
})

export const getAnnouncements = async ({
  limit = 20,
  skip = 0,
}: {
  limit?: number
  skip?: number
}): Promise<{
  total: number
  announcements: Announcement[]
}> => {
  const client = getContentfulClient()
  if (client === "noToken") {
    return {
      total: 0,
      announcements: [],
    }
  }

  try {
    const res = await client.getEntries<AnnouncementContentModel>({
      content_type: "announcement",
      order: "-fields.publishedAt",
      limit,
      skip,
    })

    return {
      total: res.total,
      announcements: res.items.map((item) =>
        announcementEntryToAnnouncement(item)
      ),
    }
  } catch (error) {
    reportError("failed to fetch announcements from Contentful", { error })
    return {
      total: 0,
      announcements: [],
    }
  }
}

export const getAnnouncement = async ({
  id,
  query,
}: {
  id: string
  query?: any
}): Promise<Announcement | null> => {
  const client = getContentfulClient()
  if (client === "noToken") return null

  try {
    const res = await client.getEntry<AnnouncementContentModel>(id, query)
    return res ? announcementEntryToAnnouncement(res) : null
  } catch (error) {
    reportError("failed to fetch specific announcement from Contentful", {
      error,
    })
    return null
  }
}
