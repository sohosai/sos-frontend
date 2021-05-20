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
      "今後も学園祭について情報発信を行ってまいりますので、ご確認のほどよろしくお願い申し上げます。",
    ].join("\n"),
  },
  {
    id: "df454852-f9af-40cd-b281-f1a3c11265e2",
    date: dayjs.tz("2021-05-20T18:30:00", "Asia/Tokyo"),
    title: "雙峰祭ガイダンス(オンラインステージ企画用)公開",
    text: [
      "オンラインステージ企画用雙峰祭ガイダンスを公開いたします。",
      "雙峰祭ガイダンスとは、前回学園祭からの変更点や特に重要な内容を簡潔にまとめた動画でございます。今年度は非常に多くの変更点がございますので、募集要項をご確認の際にぜひご一緒にご視聴ください。",
    ].join("\n"),
  },
]
