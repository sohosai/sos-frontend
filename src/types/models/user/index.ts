import type { UserRole } from "./userRole"

export type User = Readonly<{
  id: UserId
  created_at: Date
  name: UserName
  kana_name: UserKanaName
  email: string
  phone_number: string
  role: UserRole
  category: UserCategory
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

export type UserCategory =
  | "undergraduate_student"
  | "graduate_student"
  | "academic_staff"

export const userCategoryToUiText = (userCategory: UserCategory): string => {
  const map: {
    [key in UserCategory]: string
  } = {
    undergraduate_student: "学群生",
    graduate_student: "院生",
    academic_staff: "教職員",
  }
  return map[userCategory]
}
