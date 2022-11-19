import { PageOptions } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import { pagesPath } from "../../utils/$path"

import styles from "./links.module.scss"

export const Links: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const router = useRouter()

  if (layout === "empty") return null

  type Link = {
    href: {
      pathname: string
      hash?: string
    }
    title: string[]
    icon: string
    visible: () => boolean
    active: () => boolean
  }

  const links = [
    {
      href: pagesPath.$url(),
      title: ["トップ", "ページ"],
      icon: "home",
      visible: () => true,
      active: () => router.pathname === pagesPath.$url().pathname,
    },
  ]

  return (
    <menu className={styles.wrapper}>
      <ul
        className={styles.links}
        style={{
          gridTemplateRows: `repeat(${Math.min(links.length, 4)}, 1fr)`,
        }}
      >
        {links.map(({ href, title, icon, active }, index) => {
          const text: (string | JSX.Element)[] = []
          title.forEach((value, index) => {
            text.push(value)
            if (index < title.length - 1) {
              text.push(<wbr />)
            }
          })

          return (
            <li key={index}>
              <Link href={href}>
                <a className={styles.link} data-active={active()}>
                  <i className={`jam-icons jam-${icon} ${styles.linkIcon}`} />
                  <p className={styles.label}>{text}</p>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </menu>
  )
}
