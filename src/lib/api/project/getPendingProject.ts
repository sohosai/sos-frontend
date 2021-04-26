import { client } from "../client"

import type { PendingProject } from "../../../types/models/project"

declare namespace getPendingProject {
  type Props = Readonly<{
    pendingProjectId: string
    idToken: string
  }>
}

const getPendingProject = async ({
  pendingProjectId,
  idToken,
}: getPendingProject.Props): Promise<{
  pending_project: PendingProject
}> => {
  return client({ idToken })
    .get("pending-project/get", {
      searchParams: {
        pending_project_id: pendingProjectId,
      },
    })
    .json()
}

export { getPendingProject }
