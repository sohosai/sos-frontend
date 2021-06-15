import { client } from "../client"

import type { File } from "src/types/models/files"

declare namespace createFile {
  type Props = { props: { body: FormData }; idToken: string }
}

const createFile = async ({
  props: { body },
  idToken,
}: createFile.Props): Promise<
  | { files: Array<{ name: string; file: File }>; error: null }
  | { error: "outOfFileUsageQuota" }
> => {
  try {
    const { files } = await client({ idToken })
      .post("file/create", {
        body,
      })
      .json()
    return { files, error: null }
  } catch (err) {
    const body = await err.response?.json()

    switch (body.error?.info?.type) {
      case "OUT_OF_FILE_USAGE_QUOTA":
        return { error: "outOfFileUsageQuota" }
    }

    throw body ?? err
  }
}

export { createFile }
