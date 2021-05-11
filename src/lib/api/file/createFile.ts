import { client } from "../client"

import type { File } from "src/types/models/files"

declare namespace createFile {
  type Props = { props: { body: any }; idToken: string }
}

const createFile = async ({
  props: { body },
  idToken,
}: createFile.Props): Promise<Array<{ name: string; file: File }>> => {
  console.log(...body)
  return client({ idToken })
    .post("file/create", {
      body,
    })
    .json()
}

export { createFile }
