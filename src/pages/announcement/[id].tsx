import { PageFC } from "next"
import { useRouter } from "next/router"
import Link from "next/link"

import { announcements } from "src/constants/announcements"

import { pagesPath } from "src/utils/$path"

import { Head, Panel, ParagraphWithUrlParsing } from "src/components"

import styles from "./[id].module.scss"

const Announcement: PageFC = () => {
  const router = useRouter()

  // TODO: handle undefined
  const { id: passedId } = router.query

  const announcement = announcements.find(({ id }) => id === passedId)

  return (
    <div className={styles.wrapper}>
      {announcement?.title && <Head title={announcement.title} />}
      {passedId && announcement ? (
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
                {announcement.date.format("YYYY/M/D HH:mm")}
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
