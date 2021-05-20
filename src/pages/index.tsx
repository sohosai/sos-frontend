import type { PageFC } from "next"
import Link from "next/link"

import { pagesPath, staticPath } from "src/utils/$path"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

import { Timeline } from "react-twitter-widgets"

import { announcements } from "src/constants/announcements"
import { STAGE_GUIDANCE_URL } from "src/constants/links"

import { Button, Panel } from "src/components"

import styles from "./index.module.scss"

const Index: PageFC = () => {
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
                  今後も学園祭について情報発信を行っていきますので、何卒ご理解のほどよろしくお願い申し上げます。
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
                <h3 className={styles.panelTitle}>
                  オンラインステージ用募集要項
                </h3>
                <div className={styles.newProjectsParagraph}>
                  <p className={styles.panelText}>
                    対面開催中止に伴う前回学園祭からの変更点等について記載されておりますので、企画応募をご検討の皆様は必ずご確認ください
                  </p>
                </div>
                <a
                  href={
                    staticPath.docs[
                      "オンラインステージ企画用募集要項_210519_pdf"
                    ]
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button icon="download">募集要項(ステージ企画)</Button>
                </a>
              </div>
              <div className={styles.sectionInPanel}>
                <h3 className={styles.panelTitle}>
                  オンライステージ用雙峰祭ガイダンス
                </h3>
                <div className={styles.newProjectsParagraph}>
                  <p className={styles.panelText}>
                    前回学園祭からの変更点や特に重要な内容を簡潔にまとめた動画です
                  </p>
                  <p className={styles.panelText}>
                    今年度は非常に多くの変更点がございますので、募集要項をご確認の際にぜひご一緒にご視聴ください
                  </p>
                </div>
                <a
                  href={STAGE_GUIDANCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button icon="arrow-up-right">雙峰祭ガイダンス</Button>
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
              {announcements.map(({ id, date, title }) => (
                <Link href={pagesPath.announcement._id(id).$url()} key={id}>
                  <a>
                    <div className={styles.announcementRow}>
                      <p className={styles.announcementTitle}>{title}</p>
                      <p className={styles.announcementDate}>
                        {date.format("YYYY/M/D HH:mm")}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
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
