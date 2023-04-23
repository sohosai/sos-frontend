import { HTTPError, TimeoutError } from "ky"

import { client } from "../client"

import { reportError } from "src/lib/errorTracking"
import type { File } from "src/types/models/files"

declare namespace createFile {
  type Props = { props: { body: FormData }; idToken: string }
  type ErrorType = {
    errorCode: "outOfFileUsageQuota" | "timeout" | "unknown"
    _error?: any
  }
}

const createFile = async ({
  props: { body },
  idToken,
}: createFile.Props): Promise<
  { files: Array<{ name: string; file: File }> } | createFile.ErrorType
> => {
  try {
    const { files } = await client({ idToken })
      .post("file/create", {
        body,
      })
      .json()
    return { files }
  } catch (err) {
    if (err instanceof HTTPError) {
      const body = await err.response.json()

      switch (body.error?.info?.type) {
        case "OUT_OF_FILE_USAGE_QUOTA": {
          reportError("Hit the file usage quota", {
            error: body,
          })
          return { errorCode: "outOfFileUsageQuota", _error: body }
        }
        default: {
          reportError("failed to upload new file with unknown exception", {
            error: body,
          })
          return { errorCode: "unknown", _error: body }
        }
      }
    }

    if (err instanceof TimeoutError) {
      return { errorCode: "timeout" }
    }

    reportError("failed to upload new file with unknown exception", {
      error: err,
    })
    return { errorCode: "unknown", _error: err }
  }
}

export { createFile }
