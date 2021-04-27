/**
 * リダイレクト責務
 *
 * ページにアクセスして Firebase と SOS のユーザーの fetch が終わった時点で
 * 判断できるリダイレクトはこの hook で処理
 *
 * SOS バックからのエラーなどを受けてリダイレクトする場合はその場で処理
 */

import { useEffect } from "react"

import { useRouter } from "next/router"
import type { PageOptions } from "next"

import { pagesPath } from "../../utils/$path"

import {
  isUserRoleHigherThanIncluding,
  isUserRoleLowerThanIncluding,
} from "../../types/models/user/userRole"

import { AuthNeueState } from "."

export const useRbpacRedirect = ({
  rbpac,
  authState,
}: {
  rbpac: PageOptions["rbpac"]
  authState: AuthNeueState
}): void => {
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      if (authState === null || authState.status === "error") return

      if (authState.firebaseUser?.emailVerified === false) {
        if (router.pathname !== pagesPath.email_verification.$url().pathname) {
          router.push(pagesPath.email_verification.$url())
        }
        return
      }

      if (authState.status === "firebaseSignedIn") {
        if (router.pathname !== pagesPath.init.$url().pathname) {
          router.push(pagesPath.init.$url())
        }
        return
      }

      if (
        authState.status === "signedOut" &&
        router.pathname === pagesPath.init.$url().pathname
      ) {
        router.push(pagesPath.login.$url())
      }

      const userRole = authState.sosUser?.role ?? "guest"

      // TODO: toast
      const redirect = (): void => {
        if (authState.status === "signedOut") {
          if (router.pathname !== pagesPath.login.$url().pathname) {
            router.push(pagesPath.login.$url())
          }
          return
        }

        if (userRole === "guest") {
          router.push(pagesPath.login.$url())
        } else {
          router.push(pagesPath.mypage.$url())
        }
      }

      switch (rbpac.type) {
        case "public": {
          return
        }
        case "higherThanIncluding": {
          if (
            !isUserRoleHigherThanIncluding({ userRole, criteria: rbpac.role })
          ) {
            redirect()
          }
          return
        }
        case "lowerThanIncluding": {
          if (
            !isUserRoleLowerThanIncluding({ userRole, criteria: rbpac.role })
          ) {
            redirect()
          }
          return
        }
        case "enum": {
          if (!rbpac.role.includes(userRole)) {
            redirect()
          }
          return
        }
      }
    })()
  })
}
