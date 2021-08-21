import dayjs from "dayjs"
import {
  PageFC,
  GetStaticProps,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next"
import Link from "next/link"

import styles from "./[page].module.scss"
import { Head, Panel } from "src/components"
import { getAnnouncements } from "src/lib/contentful"

import type { Announcement } from "src/types/models/announcement"
import { pagesPath } from "src/utils/$path"

const ANNOUNCEMENT_LIMIT = 20

export const getStaticPaths: GetStaticPaths = async () => {
  const { total } = await getAnnouncements({ limit: ANNOUNCEMENT_LIMIT })
  return {
    paths: Array.from(
      Array(Math.floor(total / ANNOUNCEMENT_LIMIT) + 1).keys()
    ).map((index) => ({ params: { page: String(index + 1) } })),
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<
  {
    totalPages: number
    pageIndex: number
    announcements: Announcement[]
  },
  { page: string }
> = async ({ params }) => {
  const pageIndex = params ? parseInt(params.page) : 1
  const normalizedPageIndex = isNaN(pageIndex) ? 1 : pageIndex

  try {
    const { announcements, total } = await getAnnouncements({
      limit: ANNOUNCEMENT_LIMIT,
      skip: ANNOUNCEMENT_LIMIT * (normalizedPageIndex - 1),
    })

    return {
      props: {
        totalPages: Math.floor(total / ANNOUNCEMENT_LIMIT) + 1,
        pageIndex: normalizedPageIndex,
        announcements,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      props: {
        totalPages: 1,
        pageIndex: 1,
        announcements: [],
      },
      revalidate: 60,
    }
  }
}

const AnnouncementsList: PageFC<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ totalPages, pageIndex, announcements }) => {
  return (
    <div className={styles.wrapper}>
      <Head title="お知らせ一覧" />
      <h1 className={styles.title}>お知らせ一覧</h1>
      <Panel>
        <ul className={styles.list}>
          {announcements.map(({ id, date, title }) => (
            <li className={styles.listItem} key={id}>
              <Link href={pagesPath.announcement._id(id).$url()}>
                <a className={styles.row}>
                  <p className={styles.announcementTitle}>{title}</p>
                  <p className={styles.announcementDate}>
                    {dayjs(date).format("YYYY/M/D HH:mm")}
                  </p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
AnnouncementsList.layout = "default"
AnnouncementsList.rbpac = { type: "public" }

export default AnnouncementsList
