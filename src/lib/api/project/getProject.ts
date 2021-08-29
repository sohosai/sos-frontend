import { HTTPError, TimeoutError } from "ky"
import type { Project } from "../../../types/models/project"
import { client } from "../client"

declare namespace getProject {
  type Props = Readonly<{
    projectId: string
    idToken: string
  }>

  type ErrorType = {
    errorCode: "projectNotFound" | "timeout" | "unknown"
    error?: any
  }
}

const getProject = async ({
  projectId,
  idToken,
}: getProject.Props): Promise<{ project: Project } | getProject.ErrorType> => {
  try {
    const { project } = await client({ idToken })
      .get("project/get", {
        searchParams: {
          project_id: projectId,
        },
      })
      .json()
    return { project }
  } catch (error) {
    if (error instanceof HTTPError) {
      const body = await error.response.json()
      switch (body.error?.info?.type) {
        case "PROJECT_NOT_FOUND":
          return { errorCode: "projectNotFound", error: body }
        default:
          return { errorCode: "unknown", error: body }
      }
    } else if (error instanceof TimeoutError) {
      return { errorCode: "timeout", error }
    } else {
      return { errorCode: "unknown", error }
    }
  }
}

export { getProject }
