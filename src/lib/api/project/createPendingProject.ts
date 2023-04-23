import type { PendingProject } from "../../../types/models/project"
import { client } from "../client"

declare namespace createPendingProject {
  type Props = Readonly<{
    props: Pick<
      PendingProject,
      | "name"
      | "kana_name"
      | "group_name"
      | "kana_group_name"
      | "description"
      | "category"
      | "attributes"
    >
    idToken: string
  }>
}

const createPendingProject = async ({
  props,
  idToken,
}: createPendingProject.Props): Promise<{
  pending_project: PendingProject
}> => {
  return client({ idToken })
    .post("project/prepare", {
      json: props,
    })
    .json()
}

export { createPendingProject }
