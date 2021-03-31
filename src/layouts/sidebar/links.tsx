import { FC } from "react"

import Link from "next/link"
import { useRouter } from "next/router"
import { PageOptions } from "next"

import styles from "./links.module.scss"

export const Links: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const router = useRouter()

  const links: {
    [layoutName in PageOptions["layout"]]?: Array<{
      href: string
      title: string
      active: () => boolean
    }>
  } = {
    default: [
      {
        href: "/",
        title: "トップページ",
        active: () => router.pathname === "/",
      },
      {
        href: "/login",
        title: "ログイン",
        active: () => router.pathname === "/login",
      },
      {
        href: "/signup",
        title: "アカウント登録",
        active: () => router.pathname === "/signup",
      },
    ],
  }

  return (
    <menu className={styles.wrapper}>
      <ul className={styles.links}>
        {links[layout].map(({ href, title, active }, index) => (
          <li key={index}>
            <Link href={href}>
              <a className={styles.link} data-active={active()}>
                <p className={styles.label}>{title}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </menu>
  )
}
