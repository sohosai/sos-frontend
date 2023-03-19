import { HTTPError, TimeoutError } from "ky"

import { client } from "../client"

import { FormAnswerItemInForm } from "src/types/models/form/answerItem"
import type { RegistrationFormAnswer } from "src/types/models/registrationForm"

declare namespace updateRegistrationFormAnswer {
  type Props = (
    | Readonly<{
        projectId: string
        pendingProjectId?: undefined
      }>
    | Readonly<{
        projectId?: undefined
        pendingProjectId: string
      }>
  ) &
    Readonly<{
      idToken: string
      registrationFormId: string
      items: FormAnswerItemInForm[]
    }>

  type ErrorType = {
    errorCode:
      | "invalidFormAnswer"
      | "outOfProjectCreationPeriod"
      | "timeout"
      | "unknown"
    error?: any
  }
}

const handleException = async (
  exception: unknown
): Promise<updateRegistrationFormAnswer.ErrorType> => {
  if (exception instanceof HTTPError) {
    const body = await exception.response.json()
    switch (body.error?.info?.type) {
      case "INVALID_FORM_ANSWER":
        return { errorCode: "invalidFormAnswer", error: body }
      case "OUT_OF_PROJECT_CREATION_PERIOD":
        return { errorCode: "outOfProjectCreationPeriod", error: body }
      default:
        return { errorCode: "unknown", error: body }
    }
  } else if (exception instanceof TimeoutError) {
    return { errorCode: "timeout", error: exception }
  } else {
    return { errorCode: "unknown", error: exception }
  }
}

const updateRegistrationFormAnswer = async (
  props: updateRegistrationFormAnswer.Props
): Promise<RegistrationFormAnswer | updateRegistrationFormAnswer.ErrorType> => {
  if (props.projectId) {
    try {
      const { answer } = await client({ idToken: props.idToken })
        .post("project/registration-form/answer/update", {
          json: {
            project_id: props.projectId,
            registration_form_id: props.registrationFormId,
            items: props.items.map((item) => {
              if (item.type === "checkbox") {
                return {
                  ...item,
                  answer: Object.entries(item.answer).reduce(
                    (acc: string[], [id, value]) => {
                      if (value) acc.push(id)
                      return acc
                    },
                    []
                  ),
                }
              }
              return item
            }),
          },
        })
        .json()
      return answer
    } catch (err) {
      return await handleException(err)
    }
  }

  if (props.pendingProjectId) {
    try {
      const { answer } = await client({ idToken: props.idToken })
        .post("pending-project/registration-form/answer/update", {
          json: {
            pending_project_id: props.pendingProjectId,
            registration_form_id: props.registrationFormId,
            items: props.items,
          },
        })
        .json()
      return answer
    } catch (err) {
      return await handleException(err)
    }
  }

  throw new Error("Either of projectId or pendingProjectId needed.")
}

export { updateRegistrationFormAnswer }
