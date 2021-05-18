import { client } from "../client"

import type { Project } from "../../../types/models/project"

declare namespace listProjects {
  type Props = Readonly<{
    idToken: string
  }>
}

const listProjects = async ({
  idToken,
}: listProjects.Props): Promise<{ projects: Project[] }> => {
  return client({ idToken }).get("project/list").json()
}

export { listProjects }
