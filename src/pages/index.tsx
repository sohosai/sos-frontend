import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import type { PageFC, GetStaticProps, InferGetStaticPropsType } from "next"
import Link from "next/link"

import styles from "./index.module.scss"
import { Button, Panel, Icon } from "src/components"
import {
  ANNOUNCEMENT_URL,
  PROJECT_APPLICATION_GUIDELINES_URL,
  ENGLISH_PROJECT_APPLICATION_GUIDELINES_URL,
  STAGE_PROJECT_APPLICATION_GUIDELINES_URL,
  PROJECT_COMMITMENT_FORM_URL,
  STAGE_PROJECT_COMMITMENT_FORM_URL,
  PLAN_FORM_TEMPLATE_URL,
  PLAN_FORM_EXAMPLE_URL,
} from "src/constants/links"
import { getAnnouncements } from "src/lib/contentful"
import { Announcement } from "src/types/models/announcement"
import { pagesPath } from "src/utils/$path"

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
}: {
  announcements: Array<Announcement>
}) => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>雙峰祭オンラインシステム</h1>
      <section className={styles.section} data-section="timeline">
        <h2 className={styles.sectionTitle}>お知らせ</h2>
        <div className={styles.panelRowWrapper}>
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
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>第49回筑波大学学園祭 募集要項</h2>
        <div className={styles.panelRowWrapper}>
          <Panel>
            <div className={styles.sectionInPanel}>
              <p className={styles.panelText}>
                第49回筑波大学学園祭「雙峰祭」は、対面で開催する予定でございます。
              </p>
              <p className={styles.panelText}>
                雙峰祭での企画実施をお考えの方は、雙峰祭公式サイトで掲載している募集要項をご確認の上、期間内にご応募ください。
              </p>
              <p className={styles.panelText}>
                詳しくはリンク先の資料をご覧下さい。
              </p>
              <div className={styles.links}>
                <a
                  href={ANNOUNCEMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="arrow-up-right">
                    詳細情報
                  </Button>
                </a>
                <a
                  href={PROJECT_APPLICATION_GUIDELINES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="arrow-up-right">
                    一般企画 募集要項 (PDF)
                  </Button>
                </a>
                <a
                  href={STAGE_PROJECT_APPLICATION_GUIDELINES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="arrow-up-right">
                    ステージ企画 募集要項 (PDF)
                  </Button>
                </a>
                <a
                  href={ENGLISH_PROJECT_APPLICATION_GUIDELINES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.applicationGuideLinkItem}
                >
                  <Button kind="secondary" icon="arrow-up-right">
                    Application Guideline (English)
                  </Button>
                </a>
              </div>
            </div>
          </Panel>
        </div>
      </section>
      <section className={styles.section} data-section="commitment">
        <h2 className={styles.sectionTitle}>誓約書のご提出について</h2>
        <div className={styles.panelRowWrapper}>
          <div className={styles.panelWrapper}>
            <Panel>
              <div className={styles.sectionInPanel}>
                <p className={styles.panelText}>
                  企画運営を行っていただくにあたり、いくつかの事項を了承していただく必要がございます。
                </p>
                <p className={styles.panelText}>
                  企画応募時に誓約書のご提出が必要となりますので、ご準備のほどよろしくお願いいたします。
                </p>
                <div className={styles.links}>
                  <a
                    href={PROJECT_COMMITMENT_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applicationGuideLinkItem}
                  >
                    <Button kind="secondary" icon="arrow-up-right">
                      一般企画 誓約書 (PDF)
                    </Button>
                  </a>

                  <a
                    href={STAGE_PROJECT_COMMITMENT_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applicationGuideLinkItem}
                  >
                    <Button kind="secondary" icon="arrow-up-right">
                      ステージ企画 誓約書 (PDF)
                    </Button>
                  </a>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </section>
      <section className={styles.section} data-section="plan-template">
        <h2 className={styles.sectionTitle}>企画書のご提出について</h2>
        <div className={styles.panelRowWrapper}>
          <div className={styles.panelWrapper}>
            <Panel>
              <div className={styles.sectionInPanel}>
                <p className={styles.panelText}>
                  企画を応募する際には、企画書をご提出していただく必要があります。
                </p>
                <p className={styles.panelText}>
                  記載例を準備しておりますので、企画書テンプレートを利用して運営する企画の詳細についてお知らせください。
                </p>
                <p className={styles.panelText}>
                  ご質問等ございましたらお気軽にご連絡ください。
                </p>
                <div className={styles.links}>
                  <a
                    href={PLAN_FORM_TEMPLATE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applicationGuideLinkItem}
                  >
                    <Button kind="secondary" icon="arrow-up-right">
                      企画書テンプレート (Word)
                    </Button>
                  </a>
                  <a
                    href={PLAN_FORM_EXAMPLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.applicationGuideLinkItem}
                  >
                    <Button kind="secondary" icon="arrow-up-right">
                      企画書（記載例）
                    </Button>
                  </a>
                </div>
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
