import { client } from "../client"

import type { Form, FormCondition } from "../../../types/models/form"
import type { FormItem } from "../../../types/models/form/item"

declare namespace createForm {
  type Props = Readonly<{
    props: {
      name: string
      description: string
      starts_at: number
      ends_at: number
      items: FormItem[]
      condition: FormCondition
    }
    idToken: string
  }>
}

const createForm = async ({
  props,
  idToken,
}: createForm.Props): Promise<{ form: Form }> => {
  return client({ idToken }).post("form/create", { json: props }).json()
}

export { createForm }
