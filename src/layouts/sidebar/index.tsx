import { FC } from "react"

import type { PageOptions } from "next"
import { useRouter } from "next/router"
import Link from "next/link"

import { pagesPath } from "../../utils/$path"

import { useAuth } from "../../contexts/auth"

import { isUserRoleHigherThanIncluding } from "../../types/models/user/userRole"

import { Links } from "./links"

import styles from "./index.module.scss"

const Sidebar: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const { sosUser, signout } = useAuth()

  const router = useRouter()

  if (layout === "empty") return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.topWrapper}>
        <p className={styles.logotype}>
          雙峰祭
          <br />
          オンライン
          <br />
          システム
        </p>
        <Links layout={layout} />
      </div>
      <div className={styles.bottomWrapper}>
        {sosUser && (
          <>
            {isUserRoleHigherThanIncluding({
              userRole: sosUser.role,
              criteria: "committee",
            }) && (
              <Link
                href={
                  router.pathname.startsWith(
                    pagesPath.committee.$url().pathname
                  )
                    ? pagesPath.$url()
                    : pagesPath.committee.$url()
                }
              >
                <a className={styles.switchLayoutButton}>
                  <i className={`jam-icon jam-refresh ${styles.switchIcon}`} />
                  <p className={styles.switchText}>
                    {router.pathname.startsWith(
                      pagesPath.committee.$url().pathname
                    )
                      ? "一般ページへ"
                      : "実委人ページへ"}
                  </p>
                </a>
              </Link>
            )}
            <Link href={pagesPath.mypage.$url()}>
              <a className={styles.mypageButtonWrapper}>
                <i className={`jam-icon jam-user-circle ${styles.userIcon}`} />
                <p
                  className={styles.userName}
                  title={`${sosUser.name.last} ${sosUser.name.first}`}
                >{`${sosUser.name.last} ${sosUser.name.first}`}</p>
              </a>
            </Link>
            <button
              type="button"
              className={styles.logoutButton}
              onClick={() => {
                signout()
              }}
            >
              <i className={`jam-icon jam-log-out ${styles.logoutIcon}`} />
              <p className={styles.logoutText}>ログアウト</p>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export { Sidebar }
