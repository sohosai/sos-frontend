import { ContentfulClientApi, createClient, EntryCollection } from "contentful"

const spaceId = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_TOKEN

export const getContentfulClient = (): ContentfulClientApi | "noToken" => {
  if (!spaceId || !accessToken) return "noToken"

  return createClient({
    space: spaceId,
    accessToken,
  })
}
