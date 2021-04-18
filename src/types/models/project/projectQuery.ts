import type { ProjectCategory, ProjectAttribute } from "."

export type ProjectQuery = Readonly<
  Array<{
    category: ProjectCategory | undefined
    attributes: ProjectAttribute[]
  }>
>
