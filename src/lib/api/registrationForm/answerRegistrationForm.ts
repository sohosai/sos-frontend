import { client } from "../client"

import { FormAnswerItem } from "src/types/models/form/answerItem"
import type { RegistrationFormAnswer } from "src/types/models/registrationForm"

declare namespace answerRegistrationForm {
  type Props = Readonly<{
    pendingProjectId: string
    registrationFormId: string
    items: FormAnswerItem[]
    idToken: string
  }>
}

const answerRegistrationForm = async ({
  pendingProjectId,
  registrationFormId,
  items,
  idToken,
}: answerRegistrationForm.Props): Promise<{
  answer: RegistrationFormAnswer
}> => {
  try {
    const { answer } = await client({ idToken })
      .post("pending-project/registration-form/answer", {
        json: {
          pending_project_id: pendingProjectId,
          registration_form_id: registrationFormId,
          items,
        },
      })
      .json()
    return { answer }
  } catch (error) {
    const body = await error.response?.json()
    throw body ?? error
  }
}

export { answerRegistrationForm }
