import type { UserRole } from "./userRole"

export type User = Readonly<{
  id: UserId
  created_at: Date
  name: UserName
  kana_name: UserKanaName
  email: string
  phone_number: string
  role: UserRole
  type: UserType
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

export type UserType =
  | "undergraduate_student"
  | "graduate_student"
  | "academic_staff"

export const userTypeToUiText = (userType: UserType): string => {
  const map: {
    [key in UserType]: string
  } = {
    undergraduate_student: "学群生",
    graduate_student: "院生",
    academic_staff: "教職員",
  }
  return map[userType]
}
