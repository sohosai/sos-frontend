import { useEffect } from "react"

import { useRouter } from "next/router"
import type { PageOptions } from "next"

import { pagesPath } from "../../utils/$path"

import type { PageUserRole } from "../../types"

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
  userRole,
}: {
  rbpac: PageOptions["rbpac"]
  userRole: PageUserRole
}): void => {
  const router = useRouter()

  useEffect(() => {
    if (userRole == null) return

    switch (rbpac.type) {
      case "public": {
        return
      }
      case "higherThanIncluding": {
        if (
          roleToPermissionStrength(rbpac.role) >
          roleToPermissionStrength(userRole)
        ) {
          // TODO: toast
          if (userRole === "guest") {
            router.push(pagesPath.login.$url())
          } else {
            router.push(pagesPath.mypage.$url())
          }
        }
        return
      }
      case "lowerThanIncluding": {
        if (
          roleToPermissionStrength(rbpac.role) <
          roleToPermissionStrength(userRole)
        ) {
          // userRole: "guest" の可能性はない
          // TODO: toast
          router.push(pagesPath.mypage.$url())
        }
        return
      }
      case "enum": {
        if (!rbpac.role.includes(userRole)) {
          // TODO: toast
          if (userRole === "guest") {
            router.push(pagesPath.login.$url())
          } else {
            router.push(pagesPath.mypage.$url())
          }
        }
        return
      }
    }
  })
}
