import { FC } from "react"

import type { PageOptions } from "next"

import { Sidebar } from "./sidebar"

import { Footer, ToastHub } from "src/components"

import styles from "./layout.module.scss"

const Layout: FC<Pick<PageOptions, "layout">> = ({ layout, children }) => {
  if (layout === "empty") return <>{children}</>

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar layout={layout} />
      </div>
      <div className={styles.mainArea}>
        {children}
        <Footer />
      </div>
      <div className={styles.toastHubWrapper}>
        <ToastHub />
      </div>
    </div>
  )
}

export { Layout }
