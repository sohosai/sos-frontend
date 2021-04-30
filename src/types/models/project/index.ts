import type { UserId, UserName, UserKanaName } from "../user"

export type PendingProject = Readonly<{
  id: PendingProjectId
  created_at: Date
  owner_id: UserId
  name: string
  kana_name: string
  group_name: string
  kana_group_name: string
  description: string
  category: ProjectCategory
  attributes: ProjectAttribute[]
}>

export type Project = Readonly<{
  id: ProjectId
  code: string
  created_at: Date
  owner_id: UserId
  owner_name: UserName
  owner_kana_name: UserKanaName
  subowner_id: UserId
  subowner_name: UserName
  subowner_kana_name: UserKanaName
  name: string
  kana_name: string
  group_name: string
  kana_group_name: string
  description: string
  category: ProjectCategory
  attributes: ProjectAttribute[]
}>

export type PendingProjectId = string

export type ProjectId = string

export type ProjectCategory = "general" | "stage" | "cooking" | "food"

export type ProjectAttribute = "academic" | "artistic" | "committee" | "outdoor"
