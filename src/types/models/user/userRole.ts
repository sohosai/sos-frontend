export type UserRole =
  | "administrator"
  | "committee_operator"
  | "committee"
  | "general"

export type PageUserRole = UserRole | "guest"

export const userRoleToUiText = (
  userRole: UserRole
): "一般" | "実委人" | "実委人(管理者)" | "SOS管理者" => {
  switch (userRole) {
    case "general":
      return "一般"
    case "committee":
      return "実委人"
    case "committee_operator":
      return "実委人(管理者)"
    case "administrator":
      return "SOS管理者"
  }
}

export const roleToPermissionStrength = (role: PageUserRole): number => {
  const permissionStrength: { [role in PageUserRole]: number } = {
    guest: 0,
    general: 1,
    committee: 2,
    committee_operator: 3,
    administrator: 4,
  }
  return permissionStrength[role]
}
