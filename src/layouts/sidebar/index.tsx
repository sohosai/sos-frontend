import type { PageOptions } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"

import { useAuthNeue } from "../../contexts/auth"

import { isUserRoleHigherThanIncluding } from "../../types/models/user/userRole"
import { pagesPath } from "../../utils/$path"

import styles from "./index.module.scss"
import { Links } from "./links"

const Sidebar: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const { authState } = useAuthNeue()

  const router = useRouter()

  if (layout === "empty") return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.topWrapper}>
        <Link href={pagesPath.$url()}>
          <a className={styles.logotypeWrapper}>
            <p
              className={`${styles.logotype} ${
                process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging" &&
                styles.notStaging
              }`}
            >
              雙峰祭
              <br />
              <span className={styles.logotypeKana}>オンライン</span>
              <br />
              <span className={styles.logotypeKana}>システム</span>
              {process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging" && (
                <span className={styles.stagingNotice}>テスト環境</span>
              )}
            </p>
          </a>
        </Link>
        <Links layout={layout} />
      </div>
      <div className={styles.bottomWrapper}>
        {authState?.status === "bothSignedIn" && (
          <>
            {isUserRoleHigherThanIncluding({
              userRole: authState.sosUser.role,
              criteria: "committee",
            }) && (
              <Link
                href={
                  layout === "committee"
                    ? pagesPath.$url()
                    : pagesPath.committee.$url()
                }
              >
                <a className={styles.switchLayoutButton}>
                  <i className={`jam-icons jam-refresh ${styles.switchIcon}`} />
                  <p className={styles.switchText}>
                    {layout === "committee" ? "一般ページへ" : "実委人ページへ"}
                  </p>
                </a>
              </Link>
            )}
            <Link href={pagesPath.me.$url()}>
              <a className={styles.mypageButtonWrapper}>
                <i className={`jam-icons jam-user-circle ${styles.userIcon}`} />
                <p
                  className={styles.userName}
                  title={`${authState.sosUser.name.last} ${authState.sosUser.name.first}`}
                >{`${authState.sosUser.name.last} ${authState.sosUser.name.first}`}</p>
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export { Sidebar }
