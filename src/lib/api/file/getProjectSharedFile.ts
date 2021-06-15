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

    // TODO: get filename from response header
    // console.log(Array.from(res.headers.entries()))

    return { blob: (await res.blob()) as Blob }
  } catch (err) {
    const body = await err.response?.json()

    switch (body?.error?.info?.type) {
      case "FILE_SHARING_NOT_FOUND":
        return { errorCode: "fileNotFound", error: body }
    }

    console.log({ body })
    throw body ?? err
  }
}

export { getProjectSharedFile }
