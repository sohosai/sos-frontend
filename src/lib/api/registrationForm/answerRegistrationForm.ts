import { client } from "../client"

import { FormAnswerItemInForm } from "src/types/models/form/answerItem"
import type { RegistrationFormAnswer } from "src/types/models/registrationForm"

declare namespace answerRegistrationForm {
  type Props = Readonly<{
    pendingProjectId: string
    registrationFormId: string
    items: FormAnswerItemInForm[]
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
          items: items.map((item) => {
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
    return { answer }
  } catch (error) {
    // FIXME: any
    const body = await (error as any).response?.json()
    throw body ?? error
  }
}

export { answerRegistrationForm }
