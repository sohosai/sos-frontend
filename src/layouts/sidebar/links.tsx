import { FC } from "react"

import Link from "next/link"
import { useRouter } from "next/router"
import { PageOptions } from "next"

import { pagesPath } from "../../utils/$path"

import { useAuthNeue } from "../../contexts/auth"
import { useMyProject } from "../../contexts/myProject"

import { isUserRoleHigherThanIncluding } from "../../types/models/user/userRole"

import { Spinner } from "src/components"

import styles from "./links.module.scss"

export const Links: FC<Pick<PageOptions, "layout">> = ({ layout }) => {
  const router = useRouter()
  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()
  if (authState === null || authState.status === "error") {
    return (
      <div className={styles.loadingWrapper}>
        <Spinner />
      </div>
    )
  }

  if (layout === "empty") return null

  type Link = {
    href: {
      pathname: string
      hash?: string
    }
    title: string
    icon: string
    visible: () => boolean
    active: () => boolean
  }

  const links: {
    [layoutName in Exclude<PageOptions["layout"], "empty">]: Link[]
  } = {
    default: [
      {
        href: pagesPath.$url(),
        title: "トップページ",
        icon: "home",
        visible: () =>
          authState.status !== "firebaseSignedIn" &&
          authState.firebaseUser?.emailVerified !== false,
        active: () => router.pathname === pagesPath.$url().pathname,
      },
      {
        href: pagesPath.login.$url(),
        title: "ログイン",
        icon: "log-in-alt",
        visible: () => authState.status === "signedOut",
        active: () => router.pathname === pagesPath.login.$url().pathname,
      },
      {
        href: pagesPath.signup.$url(),
        title: "ユーザー登録",
        icon: "user-plus",
        visible: () => authState.status === "signedOut",
        active: () => router.pathname === pagesPath.signup.$url().pathname,
      },
      {
        href: pagesPath.email_verification.$url(),
        title: "メールアドレス確認",
        icon: "envelope",
        visible: () => Boolean(authState.firebaseUser?.emailVerified === false),
        active: () =>
          router.pathname === pagesPath.email_verification.$url().pathname,
      },
      {
        href: pagesPath.init.$url(),
        title: "アカウント情報登録",
        icon: "user-circle",
        visible: () =>
          authState.status === "firebaseSignedIn" &&
          Boolean(authState.firebaseUser.emailVerified),
        active: () => router.pathname === pagesPath.init.$url().pathname,
      },
      {
        href: pagesPath.project.new.$url(),
        title: "企画応募",
        icon: "write",
        visible: () => authState.status === "bothSignedIn",
        active: () => router.pathname === pagesPath.project.new.$url().pathname,
      },
      {
        href: pagesPath.project.$url(),
        title: "企画",
        icon: "universe",
        visible: () =>
          authState.status === "bothSignedIn" &&
          Boolean(myProjectState?.myProject),
        active: () =>
          router.pathname === pagesPath.project.$url().pathname ||
          router.pathname === pagesPath.project.edit.$url().pathname ||
          router.pathname.startsWith(
            pagesPath.project.registration_form.answer.$url({
              query: { id: "" },
            }).pathname
          ),
      },
      {
        href: pagesPath.project.form.$url(),
        title: "申請",
        icon: "task-list",
        visible: () =>
          authState.status === "bothSignedIn" &&
          myProjectState?.error === false &&
          myProjectState.isPending === false,
        active: () =>
          router.pathname.startsWith(pagesPath.project.form.$url().pathname),
      },
      {
        href: pagesPath.project.file.$url(),
        title: "ファイル配布",
        icon: "files",
        visible: () =>
          authState.status === "bothSignedIn" &&
          myProjectState?.error === false &&
          myProjectState.isPending === false,
        active: () =>
          router.pathname.startsWith(pagesPath.project.file.$url().pathname),
      },
      {
        href: pagesPath.me.$url(),
        title: "マイページ",
        icon: "user-circle",
        visible: () => authState.status === "bothSignedIn",
        active: () => router.pathname === pagesPath.me.$url().pathname,
      },
    ],
    committee: [
      {
        href: pagesPath.committee.$url(),
        title: "実委人トップページ",
        icon: "home",
        visible: () =>
          Boolean(
            authState.status === "bothSignedIn" &&
              isUserRoleHigherThanIncluding({
                userRole: authState.sosUser.role,
                criteria: "committee",
              })
          ),
        active: () => router.pathname === pagesPath.committee.$url().pathname,
      },
      {
        href: pagesPath.committee.project.$url(),
        title: "企画",
        icon: "universe",
        visible: () =>
          authState.status === "bothSignedIn" &&
          isUserRoleHigherThanIncluding({
            userRole: authState.sosUser.role,
            criteria: "committee",
          }),
        active: () =>
          router.pathname.startsWith(
            pagesPath.committee.project.$url().pathname
          ),
      },
      {
        href: pagesPath.committee.form.$url(),
        title: "申請",
        icon: "task-list",
        visible: () =>
          Boolean(
            authState.status === "bothSignedIn" &&
              isUserRoleHigherThanIncluding({
                userRole: authState.sosUser.role,
                criteria: "committee",
              })
          ),
        active: () =>
          router.pathname.startsWith(pagesPath.committee.form.$url().pathname),
      },
      {
        href: pagesPath.committee.registration_form.$url(),
        title: "登録申請",
        icon: "task-list-dashed",
        visible: () =>
          Boolean(
            authState.status === "bothSignedIn" &&
              isUserRoleHigherThanIncluding({
                userRole: authState.sosUser.role,
                criteria: "committee",
              })
          ),
        active: () =>
          router.pathname.startsWith(
            pagesPath.committee.registration_form.$url().pathname
          ),
      },
      {
        href: pagesPath.committee.file.$url(),
        title: "ファイル配布",
        icon: "files",
        visible: () =>
          Boolean(
            authState.status === "bothSignedIn" &&
              isUserRoleHigherThanIncluding({
                userRole: authState.sosUser.role,
                criteria: "committee",
              })
          ),
        active: () =>
          router.pathname.startsWith(pagesPath.committee.file.$url().pathname),
      },
      {
        href: pagesPath.committee.user.$url(),
        title: "ユーザー",
        icon: "users",
        visible: () =>
          Boolean(
            authState.status === "bothSignedIn" &&
              isUserRoleHigherThanIncluding({
                userRole: authState.sosUser.role,
                criteria: "committee_operator",
              })
          ),
        active: () =>
          router.pathname.startsWith(pagesPath.committee.user.$url().pathname),
      },
      {
        href: pagesPath.meta.$url(),
        title: "開発者ツール",
        icon: "wrench",
        visible: () =>
          Boolean(
            authState.status === "bothSignedIn" &&
              isUserRoleHigherThanIncluding({
                userRole: authState.sosUser.role,
                criteria: "administrator",
              })
          ),
        active: () => router.pathname === pagesPath.meta.$url().pathname,
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
                  <i className={`jam-icons jam-${icon} ${styles.linkIcon}`} />
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
