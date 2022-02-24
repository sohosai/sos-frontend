import { PageFC } from "next"
import Link from "next/link"

import styles from "./index.module.scss"
import { Head, Panel } from "src/components"
import { useAuthNeue } from "src/contexts/auth"

import { isUserRoleHigherThanIncluding } from "src/types/models/user/userRole"

import { pagesPath } from "src/utils/$path"

const DevTool: PageFC = () => {
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
      href: pagesPath.dev_tool.assign_role.$url(),
      title: "管理者権限付与",
      icon: "users",
      visible: () =>
        authState?.status === "bothSignedIn" &&
        isUserRoleHigherThanIncluding({
          userRole: authState.sosUser.role,
          criteria: "administrator",
        }),
    },
    {
      href: pagesPath.dev_tool.api_caller.$url(),
      title: "API Caller",
      icon: "terminal",
      visible: () =>
        authState?.status === "bothSignedIn" &&
        isUserRoleHigherThanIncluding({
          userRole: authState.sosUser.role,
          criteria: "administrator",
        }),
    },
    {
      href: pagesPath.dev_tool.metadata.$url(),
      title: "メタデータ",
      icon: "activity",
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
      <Head title="開発者ツール" />
      <h1 className={styles.title}>開発者ツール</h1>
      <ul className={styles.panelsWrapper}>
        {links.map((link) => {
          if (!link.visible()) return

          return (
            <li className={styles.panelWrapper} key={link.href.pathname}>
              <Link href={link.href}>
                <a>
                  <Panel style={{ padding: "18px 24px" }} hoverStyle="gray">
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
DevTool.layout = "committee"
DevTool.rbpac = { type: "higherThanIncluding", role: "administrator" }

export default DevTool
