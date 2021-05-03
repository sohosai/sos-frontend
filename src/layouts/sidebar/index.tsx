import { FC } from "react"

import type { PageOptions } from "next"
import { useRouter } from "next/router"
import Link from "next/link"

import { pagesPath } from "../../utils/$path"

import { useAuthNeue } from "../../contexts/auth"

import { isUserRoleHigherThanIncluding } from "../../types/models/user/userRole"

import { Links } from "./links"

import styles from "./index.module.scss"

const Sidebar: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const { authState, signout } = useAuthNeue()

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
        {authState?.status === "bothSignedIn" && (
          <>
            {isUserRoleHigherThanIncluding({
              userRole: authState.sosUser.role,
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
                  <i className={`jam-icons jam-refresh ${styles.switchIcon}`} />
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
