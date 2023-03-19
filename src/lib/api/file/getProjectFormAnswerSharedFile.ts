import { client } from "../client"

declare namespace getProjectFormAnswerSharedFile {
  type Props = Readonly<{
    props: {
      sharingId: string
      projectId: string
      formId: string
    }
    idToken: string
  }>
}

const getProjectFormAnswerSharedFile = async ({
  props: { sharingId, projectId, formId },
  idToken,
}: getProjectFormAnswerSharedFile.Props): Promise<
  | { blob: Blob; filename?: string }
  | {
      errorCode:
        | "projectNotFound"
        | "formNotFound"
        | "fileNotFound"
        | "formAnswerNotFound"
      error?: any
    }
> => {
  try {
    const res = await client({ idToken }).get(
      "project/form/answer/file-sharing/get-file",
      {
        searchParams: {
          sharing_id: sharingId,
          project_id: projectId,
          form_id: formId,
        },
      }
    )

    const contentDisposition = res.headers
      .get("content-disposition")
      ?.split(";")
      ?.map((str) => str.trim())
    const filenameStar = contentDisposition
      ?.find((str) => str.startsWith("filename*"))
      ?.replace("filename*=UTF-8''", "")
    const filename = filenameStar ? decodeURIComponent(filenameStar) : undefined

    return { blob: (await res.blob()) as Blob, filename }
  } catch (err) {
    // FIXME: any
    const body = await (err as any).response?.json()

    switch (body?.error?.info?.type) {
      case "PROJECT_NOT_FOUND":
        return { errorCode: "projectNotFound", error: body }
      case "FORM_NOT_FOUND":
        return { errorCode: "formNotFound", error: body }
      case "FILE_SHARING_NOT_FOUND":
        return { errorCode: "fileNotFound", error: body }
      case "FORM_ANSWER_NOT_FOUND":
        return { errorCode: "formAnswerNotFound", error: body }
    }

    throw body ?? err
  }
}

export { getProjectFormAnswerSharedFile }
