import { client } from "../client"

declare namespace getFormAnswerSharedFile {
  type Props = Readonly<{
    props: {
      answerId: string
      sharingId: string
    }
    idToken: string
  }>
}

const getFormAnswerSharedFile = async ({
  props: { answerId, sharingId },
  idToken,
}: getFormAnswerSharedFile.Props): Promise<
  | { blob: Blob; filename?: string }
  | { errorCode: "fileNotFound" | "formAnswerNotFound"; error?: any }
> => {
  try {
    const res = await client({ idToken }).get(
      "form-answer/file-sharing/get-file",
      {
        searchParams: {
          answer_id: answerId,
          sharing_id: sharingId,
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
      case "FILE_SHARING_NOT_FOUND":
        return { errorCode: "fileNotFound", error: body }
      case "FORM_ANSWER_NOT_FOUND":
        return { errorCode: "formAnswerNotFound", error: body }
    }

    throw body ?? err
  }
}

export { getFormAnswerSharedFile }
