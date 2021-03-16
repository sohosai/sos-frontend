import { FC } from "react"

import type { PageOptions } from "next"

import { Links } from "./links"

import styles from "./index.module.scss"

const Sidebar: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  return (
    <>
      <p className={styles.logotype}>
        雙峰祭
        <br />
        オンライン
        <br />
        システム
      </p>
      {layout === "default" && <Links layout={layout} />}
      {/* TODO: ログインユーザーなど */}
    </>
  )
}

export { Sidebar }
