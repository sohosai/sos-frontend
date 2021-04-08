import { FC } from "react"

import type { PageOptions } from "next"
import Link from "next/link"

import { pagesPath } from "../../utils/$path"

import { useAuth } from "../../contexts/auth"

import { Links } from "./links"

import styles from "./index.module.scss"

const Sidebar: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const { sosUser, signout } = useAuth()

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
