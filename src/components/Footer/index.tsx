import Link from "next/link"
import { FC } from "react"

import styles from "./index.module.scss"
import {
  SOHOSAI_COM,
  TWITTER_SOHOSAI,
  INSTAGRAM,
  FACEBOOK,
} from "src/constants/links"
import { pagesPath } from "src/utils/$path"

export const Footer: FC = () => (
  <footer className={styles.wrapper}>
    <a
      href={SOHOSAI_COM}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkItem}
    >
      学園祭実行委員会
    </a>
    <Link href={pagesPath.privacy_policy.$url()}>
      <a className={styles.linkItem}>プライバシーポリシー</a>
    </Link>
    <div className={styles.socialLinks}>
      <a
        href={TWITTER_SOHOSAI}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkItem}
        title="Twitter"
      >
        <span className={`jam-icons jam-twitter ${styles.snsIcon}`} />
      </a>
      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkItem}
        title="Instagram"
      >
        <span className={`jam-icons jam-instagram ${styles.snsIcon}`} />
      </a>
      <a
        href={FACEBOOK}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkItem}
        title="Facebook"
      >
        <span className={`jam-icons jam-facebook ${styles.snsIcon}`} />
      </a>
    </div>
  </footer>
)
