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
import {
  STAGE_GUIDANCE_URL,
  GENERAL_PROJECT_GUIDANCE_URL,
} from "src/constants/links"

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
                    雙峰祭ガイダンス
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
              {announcements
                .sort((a, b) => (a.date.isAfter(b.date) ? -1 : 1))
                .map(({ id, date, title }) => (
                  <Link
                    href={pagesPath.announcement.$url({ query: { id } })}
                    key={id}
                  >
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
