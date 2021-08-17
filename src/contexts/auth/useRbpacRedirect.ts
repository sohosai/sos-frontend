/**
 * リダイレクト責務
 *
 * ページにアクセスして Firebase と SOS のユーザーの fetch が終わった時点で
 * 判断できるリダイレクトはこの hook で処理
 *
 * SOS バックからのエラーなどを受けてリダイレクトする場合はその場で処理
 */

import type { PageOptions } from "next"
import { useRouter } from "next/router"
import { useEffect, useRef, MutableRefObject } from "react"

import {
  isUserRoleHigherThanIncluding,
  isUserRoleLowerThanIncluding,
} from "../../types/models/user/userRole"
import { pagesPath } from "../../utils/$path"

import { AuthNeueState } from "."
import { useToastDispatcher } from "src/contexts/toast"

export const useRbpacRedirect = ({
  rbpac,
  authState,
  hasBeenSignedIn,
  setRedirectSettled,
}: {
  rbpac?: PageOptions["rbpac"]
  authState: AuthNeueState
  hasBeenSignedIn: MutableRefObject<boolean>
  setRedirectSettled: () => void
}): void => {
  const router = useRouter()
  const { addToast } = useToastDispatcher()

  const emailVerificationToastDispatched = useRef(false)
  const initToastDispatched = useRef(false)

  useEffect(() => {
    ;(async () => {
      if (authState === null || authState.status === "error") return

      // FIXME: 責務外だと思うのでまともな方法で解決する
      if (router.pathname === pagesPath.not_supported.$url().pathname) return

      if (authState.firebaseUser?.emailVerified === false) {
        router.push(pagesPath.email_verification.$url())
        setRedirectSettled()
        if (emailVerificationToastDispatched.current === false) {
          emailVerificationToastDispatched.current = true
          addToast({ title: "メールアドレスの確認をお願いします" })
        }
        return
      }

      if (authState.status === "firebaseSignedIn") {
        router.push(pagesPath.init.$url())
        setRedirectSettled()
        if (initToastDispatched.current === false) {
          initToastDispatched.current = true
          addToast({ title: "アカウント情報を登録してください" })
        }
        return
      }

      if (
        authState.status === "signedOut" &&
        (router.pathname === pagesPath.init.$url().pathname ||
          router.pathname === pagesPath.email_verification.$url().pathname)
      ) {
        router.push(pagesPath.login.$url())
        setRedirectSettled()
        return
      }

      const userRole = authState.sosUser?.role ?? "guest"

      const redirect = (): void => {
        if (authState.status === "signedOut") {
          if (hasBeenSignedIn.current === true) {
            router.push(pagesPath.$url())
            addToast({ title: "ログアウトしました" })
          } else {
            router.push(pagesPath.login.$url())
            addToast({ title: "ログインしてください" })
          }
          return
        }

        if (userRole === "guest") {
          addToast({ title: "ログインしてください" })
          router.push(pagesPath.login.$url())
        } else {
          if (
            router.pathname !== pagesPath.login.$url().pathname &&
            router.pathname !== pagesPath.init.$url().pathname
          ) {
            addToast({ title: "アクセスできないページです" })
          }
          router.push(pagesPath.me.$url())
        }
      }

      switch (rbpac?.type) {
        case "public": {
          setRedirectSettled()
          return
        }
        case "higherThanIncluding": {
          if (
            !isUserRoleHigherThanIncluding({ userRole, criteria: rbpac.role })
          ) {
            redirect()
          } else {
            setRedirectSettled()
          }
          return
        }
        case "lowerThanIncluding": {
          if (
            !isUserRoleLowerThanIncluding({ userRole, criteria: rbpac.role })
          ) {
            redirect()
          } else {
            setRedirectSettled()
          }
          return
        }
        case "enum": {
          if (!rbpac.role.includes(userRole)) {
            redirect()
          } else {
            setRedirectSettled()
          }
          return
        }
      }
    })()
  }, [authState, rbpac])
}
