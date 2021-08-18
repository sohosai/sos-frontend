import { ContentfulClientApi, createClient, Entry } from "contentful"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

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
      label: asset.fields.title,
    })),
    ...(item.fields.links ?? []).map((link) => ({
      url: link.fields.url,
      label: link.fields.title,
    })),
  ],
})

export const getRecentAnnouncements = async ({
  limit = 20,
}: {
  limit?: number
}): Promise<
  Announcement[] | { errorCode: "noToken" | "unknown"; error?: any }
> => {
  const client = getContentfulClient()

  if (client === "noToken") return { errorCode: "noToken" }

  try {
    const res = await client.getEntries<AnnouncementContentModel>({
      content_type: "announcement",
      order: "-fields.publishedAt",
      limit,
    })

    return res.items.map((item) => announcementEntryToAnnouncement(item))
  } catch (error) {
    return {
      errorCode: "unknown",
      error: error instanceof Error ? error.toString() : undefined,
    }
  }
}
