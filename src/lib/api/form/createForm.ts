import { HTTPError, TimeoutError } from "ky"

import type { Form, FormCondition } from "../../../types/models/form"
import type { FormItem } from "../../../types/models/form/item"
import { client } from "../client"

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
}: createForm.Props): Promise<
  | { form: Form }
  | {
      errorCode:
        | "invalidField"
        | "invalidFormItem"
        | "invalidFormPeriod"
        | "tooEarlyFormPeriodStart"
        | "timeout"
      error?: any
    }
> => {
  try {
    const { form } = await client({ idToken })
      .post("form/create", { json: props })
      .json()
    return { form }
  } catch (err) {
    if (err instanceof HTTPError) {
      const body = await err.response.json()

      switch (body.error?.info?.type) {
        case "INVALID_FIELD":
          return { errorCode: "invalidField", error: body.error }
        case "INVALID_FORM_ITEM":
          return { errorCode: "invalidFormItem", error: body.error }
        case "INVALID_FORM_PERIOD":
          return { errorCode: "invalidFormPeriod", error: body.error }
        case "TOO_EARLY_FORM_PERIOD_START":
          return { errorCode: "tooEarlyFormPeriodStart", error: body.error }
        default:
          throw body
      }
    }
    if (err instanceof TimeoutError) {
      return { errorCode: "timeout", error: err }
    }
    throw err
  }
}

export { createForm }
