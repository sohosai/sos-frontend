import { client } from "../client"

import type { Project } from "../../../types/models/project"

declare namespace getMyProject {
  type Props = Readonly<{
    idToken: string
  }>
}

const getMyProject = async ({
  idToken,
}: getMyProject.Props): Promise<{ myProject: Project | "notFound" }> => {
  try {
    const { project } = await client({ idToken }).get("me/project/get").json()
    return { myProject: project }
  } catch (err) {
    const body = await err.response?.json()
    if (body.error?.info?.type === "PROJECT_NOT_FOUND") {
      return { myProject: "notFound" }
    }
    throw body ?? err
  }
}

export { getMyProject }
