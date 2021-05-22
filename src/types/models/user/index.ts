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

export type UserCategoryType =
  | "undergraduate_student"
  | "graduate_student"
  | "academic_staff"

export type UserCategory =
  | Readonly<{
      type: Extract<UserCategoryType, "undergraduate_student">
      affiliation: string
    }>
  | Readonly<{
      type: Exclude<UserCategoryType, "undergraduate_student">
    }>
