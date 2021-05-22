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
}

const handleException = async (error: any) => {
  const body = await error.response?.json()
  if (body?.error?.info?.type === "REGISTRATION_FORM_ANSWER_NOT_FOUND") {
    return { answer: null }
  }
  throw body ?? error
}

const getMyRegistrationFormAnswer = async ({
  projectId,
  pendingProjectId,
  registrationFormId,
  idToken,
}: getMyRegistrationFormAnswer.Props): Promise<{
  answer: RegistrationFormAnswer | null
}> => {
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
