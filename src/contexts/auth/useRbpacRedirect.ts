import { useEffect } from "react"

import { useRouter } from "next/router"
import type { PageOptions } from "next"

import { pagesPath } from "../../utils/$path"

import firebase from "firebase/app"

import type { PageUserRole } from "../../types"
import type { User } from "../../types/models/user"

const roleToPermissionStrength = (role: PageUserRole) => {
  const permissionStrength: { [role in PageUserRole]: number } = {
    guest: 0,
    general: 1,
    committee: 2,
    committee_operator: 3,
    administrator: 4,
  }
  return permissionStrength[role]
}

export const useRbpacRedirect = ({
  rbpac,
  firebaseUser,
  sosUser,
}: {
  rbpac: PageOptions["rbpac"]
  firebaseUser: firebase.User
  sosUser: User
}): void => {
  const router = useRouter()

  useEffect(() => {
    if (firebaseUser === null || sosUser === null) return

    if (firebaseUser && !firebaseUser.emailVerified) {
      if (router.pathname !== pagesPath.email_verification.$url().pathname) {
        router.push(pagesPath.email_verification.$url())
      }
      return
    }

    if (firebaseUser && sosUser === undefined) {
      if (router.pathname !== pagesPath.init.$url().pathname) {
        router.push(pagesPath.init.$url())
      }
      return
    }

    const userRole = sosUser ? sosUser?.role : "guest"

    // TODO: toast
    const redirect = (): void => {
      if (firebaseUser === undefined) {
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
          roleToPermissionStrength(rbpac.role) >
          roleToPermissionStrength(userRole)
        ) {
          redirect()
        }
        return
      }
      case "lowerThanIncluding": {
        if (
          roleToPermissionStrength(rbpac.role) <
          roleToPermissionStrength(userRole)
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
  })
}
