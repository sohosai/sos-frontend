import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import type { PageFC, GetStaticProps, InferGetStaticPropsType } from "next"
import Link from "next/link"

import { Timeline } from "react-twitter-widgets"

import styles from "./index.module.scss"
import { Button, Panel, Icon } from "src/components"
import {
  GUIDANCE_URL,
  HYBRID_ANNOUNCEMENT_URL,
  PROJECT_APPLICATION_GUIDELINES_URL,
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
      <section className={styles.section} data-section="hybrid-announcement">
        <div className={styles.panelRowWrapper}>
          <div className={styles.panelWrapper}>
            <Panel>
              <h2 className={styles.panelTitle}>
                第48回筑波大学学園祭の実施形態に関するお知らせ
              </h2>
              <div className={styles.sectionInPanel}>
                <p className={styles.panelText}>
                  第48回筑波大学学園祭「雙峰祭」は、学内者限定の対面と、オンラインを組み合わせた新形態で開催する予定でございます。
                </p>
                <p className={styles.panelText}>
                  詳しくはリンク先の資料をご覧下さい。
                </p>
                <div className={styles.links}>
                  <a
                    href={HYBRID_ANNOUNCEMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applicationGuideLinkItem}
                  >
                    <Button kind="secondary" icon="arrow-up-right">
                      詳細情報
                    </Button>
                  </a>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </section>
      <section className={styles.section} data-section="manuals">
        <h2 className={styles.sectionTitle}>屋内企画・調理マニュアル</h2>
        <div className={styles.panelRowWrapper}>
          <div className={styles.panelWrapper}>
            <Panel>
              <div className={styles.sectionInPanel}>
                <p className={styles.panelText}>
                  企画を実施する上で必要となる情報がまとめられたマニュアルでございます。
                </p>
                <p className={styles.panelText}>
                  企画実施に向けて提出するべき申請や禁止事項、その他各種情報が記載されていますので、ご確認のほどよろしくお願いいたします。
                </p>
                <p className={styles.panelText}>
                  一般企画・飲食物取り扱い企画の方は屋内企画マニュアルを、調理企画の方は屋内調理マニュアルをご確認ください。
                </p>
                <p className={styles.panelText}>
                  ご質問等ございましたらお気軽にご連絡ください。
                </p>
                <div className={styles.links}>
                  <a
                    href={staticPath.docs.manual_general_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applicationGuideLinkItem}
                  >
                    <Button kind="secondary" icon="arrow-up-right">
                      屋内企画マニュアル
                    </Button>
                  </a>

                  <a
                    href={staticPath.docs.manual_cooking_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applicationGuideLinkItem}
                  >
                    <Button kind="secondary" icon="arrow-up-right">
                      屋内調理マニュアル
                    </Button>
                  </a>
                </div>
              </div>
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
                  雙峰祭での企画実施をお考えの方は、雙峰祭公式サイトで掲載している募集要項をご確認の上、期間内にご応募ください。
                </p>
                <p className={styles.panelText}>
                  また、企画応募に先立ち特に知っていただきたい事について纏めた雙峰祭ガイダンスも公開しております。
                </p>
                <p className={styles.panelText}>
                  雙峰祭オンラインシステムの使用方法についても動画内で説明しておりますので、併せてご覧ください。
                </p>
                <div className={styles.links}>
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

                  <a
                    href={GUIDANCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applicationGuideLinkItem}
                  >
                    <Button kind="secondary" icon="arrow-up-right">
                      雙峰祭ガイダンス
                    </Button>
                  </a>
                </div>
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
              ) : announcements?.length === 0 ? (
                "お知らせはありません"
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
