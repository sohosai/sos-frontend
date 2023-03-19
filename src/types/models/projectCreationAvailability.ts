import { ProjectCategory } from "./project"

export type ProjectCreationAvailability = Readonly<
  {
    [key in ProjectCategory]: boolean
  } & {
    timestamp: Date
  }
>
