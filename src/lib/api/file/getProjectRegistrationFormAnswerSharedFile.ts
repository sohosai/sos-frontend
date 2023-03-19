import { client } from "../client"

declare namespace getProjectRegistrationFormAnswerSharedFile {
  type Props = Readonly<{
    props: {
      sharingId: string
      projectId: string
      registrationFormId: string
    }
    idToken: string
  }>
}

const getProjectRegistrationFormAnswerSharedFile = async ({
  props: { sharingId, projectId, registrationFormId },
  idToken,
}: getProjectRegistrationFormAnswerSharedFile.Props): Promise<
  | { blob: Blob; filename?: string }
  | {
      errorCode:
        | "projectNotFound"
        | "registrationFormNotFound"
        | "fileNotFound"
        | "registrationFormAnswerNotFound"
      error?: any
    }
> => {
  try {
    const res = await client({ idToken }).get(
      "project/registration-form/answer/file-sharing/get-file",
      {
        searchParams: {
          sharing_id: sharingId,
          project_id: projectId,
          registration_form_id: registrationFormId,
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
      case "REGISTRATION_FORM_NOT_FOUND":
        return { errorCode: "registrationFormNotFound", error: body }
      case "FILE_SHARING_NOT_FOUND":
        return { errorCode: "fileNotFound", error: body }
      case "REGISTRATION_FORM_ANSWER_NOT_FOUND":
        return { errorCode: "registrationFormAnswerNotFound", error: body }
    }

    throw body ?? err
  }
}

export { getProjectRegistrationFormAnswerSharedFile }
