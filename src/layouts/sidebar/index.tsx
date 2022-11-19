import type { PageOptions } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState, FC } from "react"
import { pagesPath } from "../../utils/$path"

import styles from "./index.module.scss"
import { Links } from "./links"

const Sidebar: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const router = useRouter()

  const [isOpenedMobileMenu, setIsOpenedMobileMenu] = useState(false)
  const openMobileMenu = () => {
    setIsOpenedMobileMenu(!isOpenedMobileMenu)
  }

  useEffect(() =>
    router.events.on("routeChangeComplete", () => setIsOpenedMobileMenu(false))
  )

  if (layout === "empty") return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.topWrapper}>
        <Link href={pagesPath.$url()}>
          <a className={styles.logotypeWrapper}>
            <p className={styles.logotype}>
              <span className={styles.mainLogotype}>
                雙峰祭
                <br />
                <span className={styles.logotypeKana}>オンライン</span>
                <wbr />
                <span className={styles.logotypeKana}>システム</span>
              </span>
              {process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging" && (
                <span className={styles.stagingNotice}>
                  テスト
                  <wbr />
                  環境
                </span>
              )}
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
      </div>
    </div>
  )
}

export { Sidebar }
