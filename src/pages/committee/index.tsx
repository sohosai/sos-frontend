import type { PageFC } from "next"
import Link from "next/link"

import { useAuthNeue } from "src/contexts/auth"

import { isUserRoleHigherThanIncluding } from "src/types/models/user/userRole"

import { pagesPath } from "src/utils/$path"

import { Head, Panel } from "src/components"

import styles from "./index.module.scss"

const Committee: PageFC = () => {
  const { authState } = useAuthNeue()

  type Link = {
    href: {
      pathname: string
      hash?: string
    }
    title: string
    icon: string
    visible: () => boolean
  }

  const links: Link[] = [
    {
      href: pagesPath.committee.project.$url(),
      title: "企画",
      icon: "universe",
      visible: () => true,
    },
    {
      href: pagesPath.committee.form.$url(),
      title: "申請",
      icon: "task-list",
      visible: () => true,
    },
    {
      href: pagesPath.committee.registration_form.$url(),
      title: "登録申請",
      icon: "task-list-dashed",
      visible: () => true,
    },
    {
      href: pagesPath.committee.file.$url(),
      title: "ファイル配布",
      icon: "files",
      visible: () =>
        authState?.status === "bothSignedIn" &&
        isUserRoleHigherThanIncluding({
          userRole: authState.sosUser.role,
          criteria: "committee",
        }),
    },
    {
      href: pagesPath.committee.user.$url(),
      title: "ユーザー",
      icon: "users",
      visible: () =>
        authState?.status === "bothSignedIn" &&
        isUserRoleHigherThanIncluding({
          userRole: authState.sosUser.role,
          criteria: "committee_operator",
        }),
    },
    {
      href: pagesPath.committee.meta.$url(),
      title: "開発者ツール",
      icon: "wrench",
      visible: () =>
        authState?.status === "bothSignedIn" &&
        isUserRoleHigherThanIncluding({
          userRole: authState.sosUser.role,
          criteria: "administrator",
        }),
    },
  ]

  return (
    <div className={styles.wrapper}>
      <Head title="実委人トップページ" />
      <h1 className={styles.title}>実委人トップページ</h1>
      <ul className={styles.panelsWrapper}>
        {links.map((link) => {
          if (!link.visible()) return

          return (
            <li className={styles.panelWrapper} key={link.href.pathname}>
              <Link href={link.href}>
                <a>
                  <Panel style={{ padding: "24px" }}>
                    <div className={styles.panelInner}>
                      <div className={styles.panelContentRight}>
                        <div className={styles.panelIconBg} aria-hidden>
                          <span
                            className={`jam-icons jam-${link.icon} ${styles.panelIcon}`}
                          />
                        </div>
                        <p className={styles.panelTitle}>{link.title}</p>
                      </div>
                      <span
                        className={`jam-icons jam-arrow-right ${styles.linkArrowIcon}`}
                      />
                    </div>
                  </Panel>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
Committee.layout = "committee"
Committee.rbpac = { type: "higherThanIncluding", role: "committee" }

export default Committee
