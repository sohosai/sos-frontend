import type { PageOptions } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState, FC } from "react"

import { useAuthNeue } from "../../contexts/auth"

import { isUserRoleHigherThanIncluding } from "../../types/models/user/userRole"
import { pagesPath } from "../../utils/$path"

import styles from "./index.module.scss"
import { Links } from "./links"

const Sidebar: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const { authState } = useAuthNeue()

  const router = useRouter()

  const [isOpenedMobileMenu, setIsOpenedMobileMenu] = useState(false)
  const openMobileMenu = () => {
    setIsOpenedMobileMenu(!isOpenedMobileMenu)
  }

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
              <span className={styles.mainLogotype}>
                雙峰祭
                <br />
                <span className={styles.logotypeKana}>オンライン</span>
                <wbr />
                <span className={styles.logotypeKana}>システム</span>
              </span>
              {process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging" ||
                (true && (
                  <span className={styles.stagingNotice}>
                    テスト
                    <wbr />
                    環境
                  </span>
                ))}
            </p>
          </a>
        </Link>
        <div className={styles.mobileMenuIconWrapper}>
          <div
            className={styles.mobileMenuIcon}
            data-active={isOpenedMobileMenu}
            onClick={openMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className={styles.content} data-opened={isOpenedMobileMenu}>
        <Links layout={layout} />
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
                    <i
                      className={`jam-icons jam-refresh ${styles.switchIcon}`}
                    />
                    <p className={styles.switchText}>
                      {layout === "committee"
                        ? "一般ページへ"
                        : "実委人ページへ"}
                    </p>
                  </a>
                </Link>
              )}
              <Link href={pagesPath.me.$url()}>
                <a className={styles.mypageButtonWrapper}>
                  <i
                    className={`jam-icons jam-user-circle ${styles.userIcon}`}
                  />
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
    </div>
  )
}

export { Sidebar }
