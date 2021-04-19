import { client } from "../client"

import type { PendingProject } from "../../../types/models/project"

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
  // FIXME: subowner 関連がバックでリリースされ次第戻す
  // pending_project: PendingProject
  project: PendingProject
}> => {
  return (
    client({ idToken })
      // FIXME:
      // .post("project/prepare", {
      .post("project/create", {
        json: props,
      })
      .json()
  )
}

export { createPendingProject }
