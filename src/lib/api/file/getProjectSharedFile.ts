import { client } from "../client"

declare namespace getProjectSharedFile {
  type Props = Readonly<{
    props: {
      projectId: string
      sharingId: string
    }
    idToken: string
  }>
}

const getProjectSharedFile = async ({
  props: { projectId, sharingId },
  idToken,
}: getProjectSharedFile.Props): Promise<
  { blob: Blob; filename?: string } | { errorCode: "fileNotFound"; error?: any }
> => {
  try {
    const res = await client({ idToken }).get("project/file-sharing/get-file", {
      searchParams: {
        project_id: projectId,
        sharing_id: sharingId,
      },
    })

    const contentDisposition = res.headers
      .get("content-disposition")
      ?.split(";")
      ?.map((str) => str.trim())
    const filenameStar = contentDisposition
      ?.find((str) => str.startsWith("filename*"))
      // TODO: これで大丈夫か?
      ?.replace("filename*=UTF-8''", "")
    const filename = filenameStar ? decodeURIComponent(filenameStar) : undefined

    return { blob: (await res.blob()) as Blob, filename }
  } catch (err) {
    // FIXME: any
    const body = await (err as any).response?.json()

    switch (body?.error?.info?.type) {
      case "FILE_SHARING_NOT_FOUND":
        return { errorCode: "fileNotFound", error: body }
    }

    throw body ?? err
  }
}

export { getProjectSharedFile }
