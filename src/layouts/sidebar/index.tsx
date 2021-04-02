import { FC } from "react"

import type { PageOptions } from "next"
import Link from "next/link"

import { pagesPath } from "../../utils/$path"

import { useAuth } from "../../contexts/auth"

import { Links } from "./links"

import styles from "./index.module.scss"

const Sidebar: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const { sosUser } = useAuth()

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
        {layout === "default" && <Links layout={layout} />}
      </div>
      <div className={styles.bottomWrapper}>
        {sosUser && (
          <Link href={pagesPath.mypage.$url()}>
            <a className={styles.mypageButtonWrapper}>
              <i className={`jam-icon jam-user-circle ${styles.userIcon}`} />
              <p
                className={styles.userName}
                title={`${sosUser.name.last} ${sosUser.name.first}`}
              >{`${sosUser.name.last} ${sosUser.name.first}`}</p>
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}

export { Sidebar }
