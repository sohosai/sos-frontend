import { client } from "../client"

import type { PendingProjectId, Project } from "../../../types/models/project"

declare namespace acceptSubowner {
  type Props = Readonly<{
    pendingProjectId: PendingProjectId
    idToken: string
  }>
}

const acceptSubowner = async ({
  pendingProjectId,
  idToken,
}: acceptSubowner.Props): Promise<{
  project: Project
}> => {
  return client({ idToken })
    .post("project/create", {
      json: {
        pending_project_id: pendingProjectId,
      },
    })
    .json()
}

export { acceptSubowner }
