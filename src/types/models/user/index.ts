export type User = Readonly<{
  id: UserId
  created_at: Date
  name: UserName
  kana_name: UserKanaName
  email: string
  phone_number: string
  affiliation: string
  role: UserRole
}>

export type UserId = string

export type UserName = Readonly<{
  first: string
  last: string
}>

export type UserKanaName = Readonly<{
  first: string
  last: string
}>

export type UserRole =
  | "administrator"
  | "committee_operator"
  | "committee"
  | "general"

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
