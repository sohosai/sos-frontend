import dayjs from "dayjs"
import type {
  PageFC,
  GetStaticProps,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next"
import Link from "next/link"

import styles from "./[id].module.scss"
import { Head, Panel, ParagraphWithUrlParsing } from "src/components"
import {
  getAnnouncement,
  getRecentAnnouncements,
} from "src/lib/contentful/index"

import type { PromiseType } from "src/types/utils"

import { pagesPath } from "src/utils/$path"

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await getRecentAnnouncements({ limit: 100 })
  return {
    paths:
      res && "errorCode" in res
        ? []
        : res.map(({ id }) => ({ params: { id } })),
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<
  {
    announcement: PromiseType<ReturnType<typeof getAnnouncement>>
  },
  { id: string }
> = async ({ params }) => {
  const announcement = params
    ? await getAnnouncement({ id: params.id })
    : { errorCode: "unknown" as const }
  return {
    props: {
      announcement,
    },
  }
}

const Announcement: PageFC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  announcement,
}) => {
  return (
    <div className={styles.wrapper}>
      <Head
        title={
          announcement && "errorCode" in announcement
            ? "お知らせが見つかりませんでした"
            : announcement.title
        }
      />
      {announcement && !("errorCode" in announcement) ? (
        <>
          <h1 className={styles.title}>{announcement.title}</h1>
          <Panel style={{ padding: "48px" }}>
            <div className={styles.articleWrapper}>
              <div className={styles.textWrapper}>
                <ParagraphWithUrlParsing
                  text={announcement.text}
                  normalTextClassName={styles.paragraph}
                  urlClassName={styles.paragraph}
                />
              </div>
              {announcement.links && (
                <div className={styles.linksWrapper}>
                  {announcement.links?.map(({ url, label }) => (
                    <a
                      target="_blank"
                      href={url}
                      rel="noopener noreferrer"
                      key={url}
                      className={styles.link}
                    >
                      <span
                        className={`jam-icons jam-link ${styles.linkIcon}`}
                      />
                      {label ?? url}
                    </a>
                  ))}
                </div>
              )}
              <p className={styles.date}>
                {dayjs(announcement.date).format("YYYY/M/D HH:mm")}
              </p>
            </div>
          </Panel>
        </>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            <p>お探しのお知らせが見つかりませんでした</p>
          </div>
        </Panel>
      )}
      <div className={styles.goBackButton}>
        <Link href={pagesPath.$url()}>
          <a className={styles.goBackButtonText}>
            <span
              className={`jam-icons jam-arrow-left ${styles.goBackButtonIcon}`}
            />
            トップページへ戻る
          </a>
        </Link>
      </div>
    </div>
  )
}
Announcement.layout = "default"
Announcement.rbpac = { type: "public" }

export default Announcement
