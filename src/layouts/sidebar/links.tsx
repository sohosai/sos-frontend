import { FC } from "react"

import Link from "next/link"
import { useRouter, NextRouter } from "next/router"
import { PageOptions } from "next"

import styles from "./links.module.scss"

type Links = {
  [layoutName in PageOptions["layout"]]?: {
    href: string
    title: string
    active: boolean | ((router: NextRouter) => boolean)
  }[]
}

const links: Links = {
  default: [
    {
      href: "/",
      title: "トップページ",
      active: (router) => router.pathname === "/",
    },
    {
      href: "/login",
      title: "ログイン",
      active: (router) => router.pathname === "/login",
    },
    {
      href: "/register",
      title: "アカウント登録",
      active: (router) => router.pathname === "register",
    },
  ],
}

export const Links: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const router = useRouter()

  return (
    <menu className={styles.wrapper}>
      <ul className={styles.links}>
        {links[layout].map(({ href, title, active }, index) => (
          <li key={index}>
            <Link href={href}>
              <a className={styles.link} data-active={active(router)}>
                <p className={styles.label}>{title}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </menu>
  )
}
