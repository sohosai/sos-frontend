import { HTTPError, TimeoutError } from "ky"

import { client } from "../client"

import type {
  Project,
  PendingProject,
  ProjectCategory,
  ProjectAttribute,
} from "src/types/models/project"

declare namespace updateProjectInfo {
  type Props = (
    | Readonly<{
        projectId: string
      }>
    | Readonly<{
        pendingProjectId: string
      }>
  ) &
    Readonly<{
      idToken: string
      body: {
        name: string
        kanaName: string
        groupName: string
        kanaGroupName: string
        description: string
        category: ProjectCategory
        attributes: ProjectAttribute[]
      }
    }>

  type ErrorType = {
    errorCode:
      | "projectNotFound"
      | "pendingProjectNotFound"
      | "outOfProjectCreationPeriod"
      | "timeout"
      | "unknown"
    error: any
  }
}

async function updateProjectInfo(
  props: Extract<updateProjectInfo.Props, { projectId: string }>
): Promise<Project | updateProjectInfo.ErrorType>
async function updateProjectInfo(
  props: Extract<updateProjectInfo.Props, { pendingProjectId: string }>
): Promise<PendingProject | updateProjectInfo.ErrorType>
async function updateProjectInfo(
  props: updateProjectInfo.Props
): Promise<Project | PendingProject | updateProjectInfo.ErrorType> {
  if ("projectId" in props) {
    try {
      const { project } = await client({ idToken: props.idToken })
        .post("project/update", {
          json: {
            id: props.projectId,
            name: props.body.name,
            kana_name: props.body.kanaName,
            group_name: props.body.groupName,
            kana_group_name: props.body.kanaGroupName,
            description: props.body.description,
            category: props.body.category,
            attributes: props.body.attributes,
          },
        })
        .json()
      return project
    } catch (err) {
      if (err instanceof HTTPError) {
        const body = await err.response.json()
        switch (body.error?.info?.type) {
          case "PROJECT_NOT_FOUND": {
            return { errorCode: "projectNotFound", error: err }
          }
          case "OUT_OF_PROJECT_CREATION_PERIOD": {
            return { errorCode: "outOfProjectCreationPeriod", error: err }
          }
        }
      } else if (err instanceof TimeoutError) {
        return { errorCode: "timeout", error: err }
      } else {
        return { errorCode: "unknown", error: err }
      }
    }
  } else {
    try {
      const { pending_project } = await client({
        idToken: props.idToken,
      })
        .post("pending-project/update", {
          json: {
            id: props.pendingProjectId,
            name: props.body.name,
            kana_name: props.body.kanaName,
            group_name: props.body.groupName,
            kana_group_name: props.body.kanaGroupName,
            description: props.body.description,
            category: props.body.category,
            attributes: props.body.attributes,
          },
        })
        .json()
      return pending_project
    } catch (err) {
      if (err instanceof HTTPError) {
        const body = await err.response.json()
        switch (body.error?.info?.type) {
          case "PENDING_PROJECT_NOT_FOUND": {
            return { errorCode: "pendingProjectNotFound", error: err }
          }
          case "OUT_OF_PROJECT_CREATION_PERIOD": {
            return { errorCode: "outOfProjectCreationPeriod", error: err }
          }
        }
      } else if (err instanceof TimeoutError) {
        return { errorCode: "timeout", error: err }
      } else {
        return { errorCode: "unknown", error: err }
      }
    }
  }

  throw new Error("Either of projectId or pendingProjectId needed.")
}

export { updateProjectInfo }
