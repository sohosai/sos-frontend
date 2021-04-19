import { client } from "../client"

import type { Project } from "../../../types/models/project"

declare namespace listMyProjects {
  type Props = Readonly<{
    idToken: string
  }>
}

const listMyProjects = async ({
  idToken,
}: listMyProjects.Props): Promise<{ projects: Project[] }> => {
  return client({ idToken }).get("me/project/list").json()
}

export { listMyProjects }
