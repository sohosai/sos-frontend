import { HTTPError, TimeoutError } from "ky"

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

  type ErrorType =
    | {
        errorCode: "invalidField"
        field: string
        error: any
      }
    | {
        errorCode:
          | "alreadyProjectOwner"
          | "alreadyProjectSubowner"
          | "alreadyPendingProjectOwner"
          | "outOfProjectCreationPeriod"
          | "duplicatedProjectAttributes"
          | "timeout"
          | "unknown"
        error?: any
      }
}

const createPendingProject = async ({
  props,
  idToken,
}: createPendingProject.Props): Promise<
  PendingProject | createPendingProject.ErrorType
> => {
  try {
    const { pending_project } = await client({ idToken })
      .post("project/prepare", {
        json: props,
      })
      .json()
    return pending_project
  } catch (error) {
    if (error instanceof HTTPError) {
      const body = await error.response.json()

      switch (body.error?.info?.type) {
        case "INVALID_FIELD":
          return {
            errorCode: "invalidField",
            field: body.error?.info?.field,
            error: body,
          }
        case "DUPLICATED_PROJECT_ATTRIBUTES":
          return {
            errorCode: "duplicatedProjectAttributes",
            error: body,
          }
        case "ALREADY_PROJECT_OWNER":
          return { errorCode: "alreadyProjectOwner", error: body }
        case "ALREADY_PROJECT_SUBOWNER":
          return { errorCode: "alreadyProjectSubowner", error: body }
        case "ALREADY_PENDING_PROJECT_OWNER":
          return { errorCode: "alreadyPendingProjectOwner", error: body }
        case "OUT_OF_PROJECT_CREATION_PERIOD":
          return { errorCode: "outOfProjectCreationPeriod", error: body }
        default:
          return { errorCode: "unknown", error: body }
      }
    } else if (error instanceof TimeoutError) {
      return { errorCode: "timeout" }
    }
    return { errorCode: "unknown", error }
  }
}

export { createPendingProject }
