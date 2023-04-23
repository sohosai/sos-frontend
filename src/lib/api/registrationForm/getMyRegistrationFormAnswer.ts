import { HTTPError, TimeoutError } from "ky"

import { client } from "../client"

import type { RegistrationFormAnswer } from "src/types/models/registrationForm"

declare namespace getMyRegistrationFormAnswer {
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
      registrationFormId: string
      idToken: string
    }>

  type ErrorType = {
    errorCode:
      | "registrationFormNotFound"
      | "projectNotFound"
      | "pendingProjectNotFound"
      | "timeout"
      | "unknown"
    error?: any
  }
}

const handleException = async (
  error: any
): Promise<{ answer: null } | getMyRegistrationFormAnswer.ErrorType> => {
  if (error instanceof HTTPError) {
    const body = await error.response.json()
    switch (body.error?.info?.type) {
      case "REGISTRATION_FORM_ANSWER_NOT_FOUND":
        return { answer: null }
      case "REGISTRATION_FORM_NOT_FOUND":
        return { errorCode: "registrationFormNotFound", error }
      case "PROJECT_NOT_FOUND":
        return { errorCode: "projectNotFound", error }
      case "PENDING_PROJECT_NOT_FOUND":
        return { errorCode: "pendingProjectNotFound", error }
      default:
        return { errorCode: "unknown", error }
    }
  } else if (error instanceof TimeoutError) {
    return { errorCode: "timeout", error }
  } else {
    return { errorCode: "unknown", error }
  }
}

const getMyRegistrationFormAnswer = async ({
  projectId,
  pendingProjectId,
  registrationFormId,
  idToken,
}: getMyRegistrationFormAnswer.Props): Promise<
  | {
      answer: RegistrationFormAnswer | null
    }
  | getMyRegistrationFormAnswer.ErrorType
> => {
  if (projectId) {
    try {
      const { answer } = await client({ idToken })
        .get("project/registration-form/answer/get", {
          searchParams: {
            project_id: projectId,
            registration_form_id: registrationFormId,
          },
        })
        .json()
      return { answer }
    } catch (err) {
      return handleException(err)
    }
  }

  if (pendingProjectId) {
    try {
      const { answer } = await client({ idToken })
        .get("pending-project/registration-form/answer/get", {
          searchParams: {
            pending_project_id: pendingProjectId,
            registration_form_id: registrationFormId,
          },
        })
        .json()
      return { answer }
    } catch (err) {
      return handleException(err)
    }
  }

  throw new Error("Either of projectId or pendingProjectId needed.")
}

export { getMyRegistrationFormAnswer }
