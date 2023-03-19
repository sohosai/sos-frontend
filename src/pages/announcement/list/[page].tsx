import { UrlObject } from "url"
import dayjs from "dayjs"
import {
  PageFC,
  GetStaticProps,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next"
import Link from "next/link"
import { VFC } from "react"

import styles from "./[page].module.scss"
import { Head, Panel, Icon } from "src/components"
import { getAnnouncements } from "src/lib/contentful"

import type { Announcement } from "src/types/models/announcement"
import { pagesPath } from "src/utils/$path"

const ANNOUNCEMENT_LIMIT = 20

const PaginationLink: VFC<
  | {
      direction: "prev" | "next"
      active?: false
      href?: never
    }
  | {
      direction: "prev" | "next"
      active: true
      href: UrlObject
    }
> = (props) => {
  const Inner: VFC<{ direction: "prev" | "next" }> = ({ direction }) => (
    <div className={styles.paginationLinkInner}>
      {direction === "prev" ? (
        <>
          <Icon icon="chevron-left" className={styles.paginationLinkIcon} />
          前へ
        </>
      ) : (
        <>
          次へ
          <Icon icon="chevron-right" className={styles.paginationLinkIcon} />
        </>
      )}
    </div>
  )

  return (
    <>
      {props.active ? (
        <Link href={props.href}>
          <a className={styles.paginationLinkAnchor} data-active={props.active}>
            <Inner direction={props.direction} />
          </a>
        </Link>
      ) : (
        <Inner direction={props.direction} />
      )}
    </>
  )
}

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
  const normalizedPageIndex = isNaN(pageIndex)
    ? 1
    : pageIndex > 0
    ? pageIndex
    : 1

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
> = ({
  totalPages,
  pageIndex,
  announcements,
}: {
  totalPages: number
  pageIndex: number
  announcements: Array<Announcement>
}) => {
  return (
    <div className={styles.wrapper}>
      <Head title="お知らせ一覧" />
      <h1 className={styles.title}>お知らせ一覧</h1>
      <Panel>
        {announcements.length === 0 ? (
          <p>お知らせが見つかりませんでした</p>
        ) : (
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
        )}
      </Panel>
      <div className={styles.paginationNavigation}>
        {pageIndex === 1 || announcements.length === 0 ? (
          <PaginationLink direction="prev" active={false} />
        ) : (
          <PaginationLink
            direction="prev"
            active={true}
            href={pagesPath.announcement.list._page(pageIndex - 1).$url()}
          />
        )}
        {pageIndex === totalPages || announcements.length === 0 ? (
          <PaginationLink direction="next" active={false} />
        ) : (
          <PaginationLink
            direction="next"
            active={true}
            href={pagesPath.announcement.list._page(pageIndex + 1).$url()}
          />
        )}
      </div>
    </div>
  )
}
AnnouncementsList.layout = "default"
AnnouncementsList.rbpac = { type: "public" }

export default AnnouncementsList
