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
  exceptional_complete_deadline?: Date | null
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

export type ProjectCategory =
  | "general"
  | "cooking_requiring_preparation_area"
  | "cooking"
  | "food"
  | "stage"

export type ProjectAttribute =
  | "academic"
  | "artistic"
  | "committee"
  | "outdoor"
  | "indoor"

export const isStage = (category: ProjectCategory): boolean => {
  return category === "stage"
}

export const projectCategoryToUiText = (
  projectCategory: ProjectCategory
): string => {
  const dict: {
    [category in ProjectCategory]: string
  } = {
    general: "一般企画（食品取扱い企画を除く）",
    cooking_requiring_preparation_area: "調理を行う企画（仕込場が必要）",
    cooking: "調理を行う企画（仕込場が不要）",
    food: "飲食物取扱い企画",
    stage: "ステージ企画",
  }
  return dict[projectCategory]
}

export const projectAttributeToUiText = ({
  projectAttribute,
  truncated = false,
}: {
  projectAttribute: ProjectAttribute
  truncated?: boolean
}): string => {
  const dict: {
    [attribute in ProjectAttribute]: string
  } = {
    academic: "学術参加枠",
    artistic: "芸術祭参加枠",
    outdoor: "屋外企画",
    indoor: "屋内企画",
    committee: "委員会企画",
  }
  const truncatedDict: {
    [attribute in ProjectAttribute]: string
  } = {
    academic: "学",
    artistic: "芸",
    outdoor: "外",
    indoor: "内",
    committee: "委",
  }

  return truncated ? truncatedDict[projectAttribute] : dict[projectAttribute]
}
