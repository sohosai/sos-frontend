import type { UserId } from "../user/"
import type { ProjectId } from "../project"
import type { ProjectQuery } from "../project/projectQuery"
import type { FormItem } from "./item"
import type { FormAnswerItem } from "./answerItem"

export type FormId = string

export type FormAnswerId = string

export type FormCondition = Readonly<{
  query: ProjectQuery
  includes: ProjectId[]
  excludes: ProjectId[]
}>

export type Form = Readonly<{
  id: FormId
  created_at: Date
  author_id: UserId
  name: string
  description: string
  starts_at: Date
  ends_at: Date
  items: FormItem[]
  condition: FormCondition
}>

export type FormAnswer = Readonly<{
  id: FormAnswerId
  project_id: ProjectId
  form_id: FormId
  created_at: Date
  author_id: UserId
  items: FormAnswerItem[]
}>
