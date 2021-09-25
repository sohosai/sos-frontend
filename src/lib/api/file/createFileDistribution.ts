import { client } from "../client"

import type { FileDistribution } from "src/types/models/files"

declare namespace createFileDistribution {
  type Props = {
    props: {
      name: string
      description: string
      files: Array<{
        projectCode: string
        fileId: string
      }>
    }
    idToken: string
  }
}

const createFileDistribution = async ({
  props: { name, description, files },
  idToken,
}: createFileDistribution.Props): Promise<
  | { distributions: FileDistribution[]; errorCode: null }
  | {
      errorCode:
        | "invalidProjectCode"
        | "projectNotFound"
        | "fileNotFound"
        | "fileSharingNotFound"
        | "duplicatedProject"
      error?: any
    }
> => {
  try {
    const { distribution } = await client({ idToken })
      .post("file-distribution/create", {
        json: {
          name,
          description,
          files: files.map(({ projectCode, fileId }) => ({
            project_code: projectCode,
            file_id: fileId,
          })),
        },
      })
      .json()
    return distribution
  } catch (err) {
    // FIXME: any
    const body = await (err as any).response?.json()

    switch (body.error?.info?.type) {
      case "INVALID_PROJECT_CODE":
        return { errorCode: "invalidProjectCode", error: body }
      case "PROJECT_NOT_FOUND":
        return { errorCode: "projectNotFound", error: body }
      case "FILE_NOT_FOUND":
        return { errorCode: "fileNotFound", error: body }
      case "FILE_SHARING_NOT_FOUND":
        return { errorCode: "fileSharingNotFound", error: body }
      case "DUPLICATED_PROJECT":
        return { errorCode: "duplicatedProject", error: body }
    }

    throw body ?? err
  }
}

export { createFileDistribution }
