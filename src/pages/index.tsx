import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import type { PageFC, GetStaticProps, InferGetStaticPropsType } from "next"
import Link from "next/link"

import { Timeline } from "react-twitter-widgets"

import styles from "./index.module.scss"
import { Button, Panel, Icon } from "src/components"
import { PROJECT_APPLICATION_GUIDELINES_URL } from "src/constants/links"
import { getAnnouncements } from "src/lib/contentful"
import { Announcement } from "src/types/models/announcement"
import { pagesPath, staticPath } from "src/utils/$path"

dayjs.extend(utc)
dayjs.extend(timezone)

export const getStaticProps: GetStaticProps<{
  announcements: Announcement[]
}> = async () => {
  const { announcements } = await getAnnouncements({ limit: 20 })

  return {
    props: {
      announcements,
    },
    revalidate: 60,
  }
}

const Index: PageFC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  announcements,
}) => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>雙峰祭オンラインシステム</h1>
      <section className={styles.section} data-section="new-projects">
        <h2 className={styles.sectionTitle}>企画募集</h2>
        <div className={styles.panelRowWrapper}>
          <div className={styles.panelWrapper}>
            <Panel>
              <div className={styles.sectionInPanel}>
                <p className={styles.panelText}>
                  雙峰祭での企画実施をお考えの方は、雙峰祭公式サイトで掲載している募集要項をご確認の上、期間内にご応募ください。
                </p>
                <div className={styles.newProjectsParagraph}></div>

                <a
                  href={PROJECT_APPLICATION_GUIDELINES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="arrow-up-right">
                    募集要項
                  </Button>
                </a>
              </div>
            </Panel>
          </div>
        </div>
      </section>
      <section className={styles.section} data-section="timeline">
        <h2 className={styles.sectionTitle}>お知らせ</h2>
        <div className={styles.panelRowWrapper} data-cols="2">
          <div className={styles.panelWrapper}>
            <Panel>
              {announcements?.length ? (
                <ul className={styles.announcementsList}>
                  {announcements.map(({ id, date, title }) => (
                    <li className={styles.announcementsListItem} key={id}>
                      <Link href={pagesPath.announcement._id(id).$url()}>
                        <a className={styles.announcementRow}>
                          <p className={styles.announcementTitle}>{title}</p>
                          <p className={styles.announcementDate}>
                            {dayjs(date).format("YYYY/M/D HH:mm")}
                          </p>
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                "お知らせの取得に失敗しました"
              )}
              <div className={styles.moreAnnouncements}>
                <Link href={pagesPath.announcement.list._page(1).$url()}>
                  <a className={styles.moreAnnouncementsLink}>
                    <Icon
                      icon="arrow-right"
                      className={styles.moreAnnouncementsLinkIcon}
                    />
                    お知らせ一覧
                  </a>
                </Link>
              </div>
            </Panel>
          </div>
          <div className={styles.panelWrapper}>
            <Panel>
              <div className={styles.twitterWrapper}>
                <Timeline
                  dataSource={{
                    sourceType: "profile",
                    screenName: "kikakurenrakun",
                  }}
                  options={{
                    lang: "en",
                    height: "600",
                    dnt: true,
                    /**
                     * ad-hoc workaround
                     * @see https://github.com/andrewsuzuki/react-twitter-widgets/issues/45
                     */
                    id: "profile:TwitterDev",
                  }}
                />
              </div>
            </Panel>
          </div>
        </div>
      </section>
    </div>
  )
}
Index.layout = "default"
Index.rbpac = { type: "public" }

export default Index
