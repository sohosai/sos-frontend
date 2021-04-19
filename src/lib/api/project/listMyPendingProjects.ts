import { client } from "../client"

import type { PendingProject } from "../../../types/models/project"

declare namespace listMyPendingProjects {
  type Props = Readonly<{
    idToken: string
  }>
}

const listMyPendingProjects = async ({
  idToken,
}: listMyPendingProjects.Props): Promise<{
  pending_projects: PendingProject[]
}> => {
  return client({ idToken }).get("me/pending-project/list").json()
}

export { listMyPendingProjects }
