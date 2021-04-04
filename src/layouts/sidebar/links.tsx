import { FC } from "react"

import Link from "next/link"
import { useRouter } from "next/router"
import { PageOptions } from "next"

import { pagesPath } from "../../utils/$path"

import { useAuth } from "../../contexts/auth"

import styles from "./links.module.scss"

export const Links: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const router = useRouter()
  const { firebaseUser, sosUser } = useAuth()

  const links: {
    [layoutName in PageOptions["layout"]]?: Array<{
      href: {
        pathname: string
        hash: string
      }
      title: string
      icon: string
      visible: () => boolean
      active: () => boolean
    }>
  } = {
    default: [
      {
        href: pagesPath.$url(),
        title: "トップページ",
        icon: "home",
        visible: () => true,
        active: () => router.pathname === pagesPath.$url().pathname,
      },
      {
        href: pagesPath.login.$url(),
        title: "ログイン",
        icon: "log-in",
        visible: () => !firebaseUser,
        active: () => router.pathname === pagesPath.login.$url().pathname,
      },
      {
        href: pagesPath.signup.$url(),
        title: "アカウント登録",
        icon: "user-plus",
        visible: () => !firebaseUser,
        active: () => router.pathname === pagesPath.signup.$url().pathname,
      },
      {
        href: pagesPath.init.$url(),
        title: "アカウント情報登録",
        icon: "user-circle",
        visible: () =>
          Boolean(firebaseUser) && firebaseUser.emailVerified && !sosUser,
        active: () => router.pathname === pagesPath.init.$url().pathname,
      },
    ],
  }

  return (
    <menu className={styles.wrapper}>
      <ul className={styles.links}>
        {links[layout].map(({ href, title, icon, visible, active }, index) => {
          if (!visible()) return

          return (
            <li key={index}>
              <Link href={href}>
                <a className={styles.link} data-active={active()}>
                  <i className={`jam-icon jam-${icon} ${styles.linkIcon}`} />
                  <p className={styles.label}>{title}</p>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </menu>
  )
}
