import type { ProjectCategory, ProjectAttribute } from "."

export type ProjectQuery = Readonly<{
  category: ProjectCategory | undefined
  attributes: ProjectAttribute[]
}>
