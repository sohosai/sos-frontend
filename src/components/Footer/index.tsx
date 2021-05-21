import { FC } from "react"

import Link from "next/link"

import { pagesPath } from "src/utils/$path"
import { SOHOSAI_COM } from "src/constants/links"

import styles from "./index.module.scss"

export const Footer: FC = () => (
  <footer className={styles.wrapper}>
    <a
      href={SOHOSAI_COM}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkItem}
    >
      雙峰祭実行委員会
    </a>
    <Link href={pagesPath.privacy_policy.$url()}>
      <a className={styles.linkItem}>プライバシーポリシー</a>
    </Link>
  </footer>
)
