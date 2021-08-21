import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import type { PageFC, GetStaticProps, InferGetStaticPropsType } from "next"
import Link from "next/link"

import { Timeline } from "react-twitter-widgets"

import styles from "./index.module.scss"
import { Button, Panel, Icon } from "src/components"
import {
  STAGE_GUIDANCE_URL,
  GENERAL_PROJECT_GUIDANCE_URL,
  GENERAL_PROJECT_GUIDANCE_2_URL,
} from "src/constants/links"
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
      <section className={styles.section} data-section="online-announcement">
        <div className={styles.panelRowWrapper}>
          <div className={styles.panelWrapper}>
            <Panel>
              <h2 className={styles.panelTitle}>対面開催中止のお知らせ</h2>
              <div className={styles.onlineDescriptions}>
                <p className={styles.onlineAnnouncementDate}>2021/05/19</p>
                <p className={styles.panelText}>
                  令和3年11月6日と11月7日に開催を予定しておりました学園祭について、新型コロナウイルスの感染が拡大している状況に鑑み対面開催の中止を決定いたしました。詳細については資料をご覧ください。
                </p>
                <p className={styles.panelText}>
                  今後も学園祭について情報発信を行ってまいりますので、何卒ご理解のほどよろしくお願い申し上げます。
                </p>
              </div>
              <a
                href={staticPath.docs["雙峰祭対面開催中止のお知らせ_pdf"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button icon="download" kind="secondary">
                  資料(PDF)
                </Button>
              </a>
            </Panel>
          </div>
        </div>
      </section>
      <section className={styles.section} data-section="new-projects">
        <h2 className={styles.sectionTitle}>企画募集</h2>
        <div className={styles.panelRowWrapper}>
          <div className={styles.panelWrapper}>
            <Panel>
              <div className={styles.sectionInPanel}>
                <p className={styles.panelText}>
                  募集要項には対面開催中止に伴う前回学園祭からの変更点等が記載されておりますので、企画応募をご検討の皆様は必ずご確認ください
                </p>
                <p className={styles.panelText}>
                  雙峰祭ガイダンスは雙峰祭オンラインシステムの使い方を説明した動画です
                </p>
                <p className={styles.panelText}>
                  企画登録の際にぜひご確認ください
                </p>
              </div>
              <div className={styles.sectionInPanel}>
                <h3 className={styles.panelTitle}>一般企画</h3>
                <div className={styles.newProjectsParagraph}></div>
                <a
                  href={staticPath.docs["オンライン一般企画用募集要項_pdf"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="download">
                    募集要項
                  </Button>
                </a>
                <a
                  href={GENERAL_PROJECT_GUIDANCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="arrow-up-right">
                    雙峰祭ガイダンス1
                  </Button>
                </a>
                <a
                  href={GENERAL_PROJECT_GUIDANCE_2_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="arrow-up-right">
                    雙峰祭ガイダンス2
                  </Button>
                </a>
              </div>
              <div className={styles.sectionInPanel}>
                <h3 className={styles.panelTitle}>オンラインステージ</h3>
                <a
                  href={
                    staticPath.docs[
                      "オンラインステージ企画用募集要項_210519_pdf"
                    ]
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="download">
                    募集要項
                  </Button>
                </a>
                <a
                  href={STAGE_GUIDANCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="arrow-up-right">
                    雙峰祭ガイダンス
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
