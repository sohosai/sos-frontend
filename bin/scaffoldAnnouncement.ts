import { readFile, writeFile } from "fs/promises"
import { v4 as uuid } from "uuid"

const announcementsFilePath = "src/constants/announcements.ts"
const insertPositionKeyword = "},"

const newAnnouncementBase = `
{
  id: "${uuid()}",
  date: dayjs.tz("2021-00-00T00:00:00", "Asia/Tokyo"),
  title: "",
  text: [
    "",
  ].join("\\n"),
},
`.trimLeft()

const scaffoldAnnouncement = async (): Promise<void> => {
  try {
    const announcementsFile = await readFile(announcementsFilePath)
    const announcementsFileString = announcementsFile.toString()
    const insertPositionIndex =
      announcementsFileString.lastIndexOf(insertPositionKeyword) +
      insertPositionKeyword.length

    const announcementsWithNewOne =
      announcementsFileString.slice(0, insertPositionIndex) +
      newAnnouncementBase +
      announcementsFileString.slice(insertPositionIndex)

    await writeFile(announcementsFilePath, announcementsWithNewOne)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

scaffoldAnnouncement()

export {}
