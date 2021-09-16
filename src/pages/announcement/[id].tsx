import dayjs from "dayjs"
import type {
  PageFC,
  GetStaticProps,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "next"
import { useRouter } from "next/router"

import styles from "./[id].module.scss"
import { Head, Panel, ParagraphWithUrlParsing, Icon } from "src/components"
import { getAnnouncement, getAnnouncements } from "src/lib/contentful/index"

import type { Announcement } from "src/types/models/announcement"

export const getStaticPaths: GetStaticPaths = async () => {
  const { announcements } = await getAnnouncements({ limit: 100 })
  return {
    paths: announcements.map(({ id }) => ({ params: { id } })),
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<
  {
    announcement: Announcement | null
  },
  { id: string }
> = async ({ params }) => {
  const announcement = params ? await getAnnouncement({ id: params.id }) : null
  return {
    props: {
      announcement,
    },
    revalidate: 60,
  }
}

const AnnouncementPage: PageFC<InferGetStaticPropsType<typeof getStaticProps>> =
  ({ announcement }) => {
    const router = useRouter()

    return (
      <div className={styles.wrapper}>
        <Head
          title={
            announcement ? announcement.title : "お知らせが見つかりませんでした"
          }
        />
        {announcement ? (
          <>
            <h1 className={styles.title}>{announcement.title}</h1>
            <Panel style={{ padding: "48px" }}>
              <div className={styles.articleWrapper}>
                <div className={styles.textWrapper}>
                  <ParagraphWithUrlParsing
                    text={announcement.text}
                    normalTextClassName={styles.paragraph}
                    urlWrapperDivClassName={styles.paragraph}
                  />
                </div>
                {announcement.links && (
                  <div className={styles.linksWrapper}>
                    {announcement.links?.map(({ url, label }) => (
                      <div key={url} className={styles.linkWrapper}>
                        <a
                          target="_blank"
                          href={url}
                          rel="noopener noreferrer"
                          className={styles.link}
                        >
                          <span
                            className={`jam-icons jam-link ${styles.linkIcon}`}
                          />
                          {label ?? url}
                        </a>
                      </div>
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
          <button
            className={styles.goBackButtonText}
            onClick={() => {
              router.back()
            }}
          >
            <Icon icon="arrow-left" className={styles.goBackButtonIcon} />
            戻る
          </button>
        </div>
      </div>
    )
  }
AnnouncementPage.layout = "default"
AnnouncementPage.rbpac = { type: "public" }

export default AnnouncementPage
