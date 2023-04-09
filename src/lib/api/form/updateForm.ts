import { HTTPError, TimeoutError } from "ky"

import type { Form, FormCondition } from "../../../types/models/form"
import { client } from "../client"
import { FormItem } from "src/types/models/form/item"

declare namespace updateForm {
  type Props = Readonly<{
    props: {
      id: string
      name: string
      description: string
      starts_at: number
      ends_at: number
      condition: FormCondition
      items: FormItem[]
    }
    idToken: string
  }>
}

const updateForm = async ({
  props,
  idToken,
}: updateForm.Props): Promise<
  | { form: Form }
  | {
      errorCode:
        | "invalidField"
        | "invalidFormItem"
        | "invalidFormPeriod"
        | "formNotFound"
        | "tooEarlyFormPeriodStart"
        | "alreadyStartedForm"
        | "timeout"
      error?: any
    }
> => {
  try {
    const { form } = await client({ idToken })
      .post("form/update", { json: props })
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
        case "FORM_NOT_FOUND":
          return { errorCode: "formNotFound", error: body.error }
        case "TOO_EARLY_FORM_PERIOD_START":
          return { errorCode: "tooEarlyFormPeriodStart", error: body.error }
        case "ALREADY_STARTED_FORM":
          return { errorCode: "alreadyStartedForm", error: body.error }
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

export { updateForm }
