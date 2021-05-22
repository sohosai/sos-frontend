import { FormItem } from "../form/item"
import { FormAnswerItem } from "../form/answerItem"
import { ProjectQuery } from "../project/projectQuery"

export type RegistrationForm = Readonly<{
  id: string
  created_at: number
  author_id: string
  name: string
  description: string
  items: FormItem[]
  query: ProjectQuery
}>

export type RegistrationFormAnswer = Readonly<{
  id: string
  registration_form_id: string
  created_at: number
  author_id: string
  project_id: string
  pending_project_id: string
  items: FormAnswerItem[]
}>
