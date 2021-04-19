import type { ProjectCategory, ProjectAttribute } from "."

export type ProjectQuery = Readonly<
  Array<{
    category: ProjectCategory | null
    attributes: ProjectAttribute[]
  }>
>
