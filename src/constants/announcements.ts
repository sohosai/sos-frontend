import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

type Announcement = {
  id: string
  date: dayjs.Dayjs
  title: string
  text: string
}

export const announcements: Announcement[] = [
  {
    id: "a9294c64-e886-44b5-b305-d8cb548d60d7",
    date: dayjs.tz("2021-05-19T18:30:00", "Asia/Tokyo"),
    title: "オンラインステージ用募集要項公開",
    text: [
      "本日付けでオンラインステージ用募集要項を公開いたします。対面開催中止に伴う前回学園祭からの変更点等について記載されておりますので、企画応募をご検討の皆様は必ずご確認ください。",
      "今後も学園祭について情報発信を行っていきますので、ご確認のほどよろしくお願い申し上げます。",
    ].join("\n"),
  },
]
