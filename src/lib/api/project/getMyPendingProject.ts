import type { PendingProject } from "../../../types/models/project"
import { client } from "../client"

declare namespace getMyPendingProject {
  type Props = Readonly<{
    idToken: string
  }>
}

const getMyPendingProject = async ({
  idToken,
}: getMyPendingProject.Props): Promise<{
  myPendingProject: PendingProject | "notFound"
}> => {
  try {
    const { pending_project: pendingProject } = await client({ idToken })
      .get("me/pending-project/get")
      .json()
    return { myPendingProject: pendingProject }
  } catch (err) {
    const body = await err.response?.json()
    if (body.error?.info?.type === "PENDING_PROJECT_NOT_FOUND") {
      return { myPendingProject: "notFound" }
    }
    throw body ?? err
  }
}

export { getMyPendingProject }
