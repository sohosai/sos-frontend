import { FC } from "react"

import Link from "next/link"
import { useRouter } from "next/router"
import { PageOptions } from "next"

import { useAuth } from "../../contexts/auth"

import styles from "./links.module.scss"

export const Links: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const router = useRouter()
  const { firebaseUser, sosUser } = useAuth()

  const links: {
    [layoutName in PageOptions["layout"]]?: Array<{
      href: string
      title: string
      visible: () => boolean
      active: () => boolean
    }>
  } = {
    default: [
      {
        href: "/",
        title: "トップページ",
        visible: () => true,
        active: () => router.pathname === "/",
      },
      {
        href: "/login",
        title: "ログイン",
        visible: () => !firebaseUser,
        active: () => router.pathname === "/login",
      },
      {
        href: "/signup",
        title: "アカウント登録",
        visible: () => !firebaseUser,
        active: () => router.pathname === "/signup",
      },
      {
        href: "/init",
        title: "アカウント情報登録",
        visible: () => Boolean(firebaseUser) && !sosUser,
        active: () => router.pathname === "/init",
      },
    ],
  }

  return (
    <menu className={styles.wrapper}>
      <ul className={styles.links}>
        {links[layout].map(({ href, title, visible, active }, index) => {
          if (!visible()) return

          return (
            <li key={index}>
              <Link href={href}>
                <a className={styles.link} data-active={active()}>
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
