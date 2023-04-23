import type { Form } from "../../../types/models/form"
import { client } from "../client"

declare namespace listForms {
  type Props = Readonly<{
    idToken: string
  }>
}

const listForms = async ({
  idToken,
}: listForms.Props): Promise<{ forms: Form[] }> => {
  return client({ idToken }).get("form/list").json()
}

export { listForms }
