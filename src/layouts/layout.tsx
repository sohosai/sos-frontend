import { FC } from "react"

import type { PageOptions } from "next"

import { Sidebar } from "./sidebar"

import styles from "./layout.module.scss"

const Layout: FC<Pick<PageOptions, "layout">> = ({ layout, children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar layout={layout} />
      </div>
      <div className={styles.mainArea}>{children}</div>
    </div>
  )
}

export { Layout }
