import { HTTPError, TimeoutError } from "ky"

import type { Form } from "../../../types/models/form"
import type { FormItem } from "../../../types/models/form/item"
import type { ProjectQuery } from "../../../types/models/project/projectQuery"
import { client } from "../client"

declare namespace createRegistrationForm {
  type Props = Readonly<{
    props: {
      name: string
      description: string
      items: FormItem[]
      query: ProjectQuery
    }
    idToken: string
  }>
}

const createRegistrationForm = async ({
  props,
  idToken,
}: createRegistrationForm.Props): Promise<
  | { form: Form }
  | {
      errorCode:
        | "invalidField"
        | "invalidFormItem"
        | "invalidFormPeriod"
        | "alreadyStartedProjectCreationPeriod"
        | "timeout"
      error?: any
    }
> => {
  try {
    const { form } = await client({ idToken })
      .post("registration-form/create", { json: props })
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
        case "ALREADY_STARTED_PROJECT_CREATION_PERIOD":
          return {
            errorCode: "alreadyStartedProjectCreationPeriod",
            error: body.error,
          }
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

export { createRegistrationForm }
