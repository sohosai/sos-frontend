import { client } from "../client"

import type { Form } from "../../../types/models/form/"
import { FormAnswerItemInForm } from "../../../types/models/form/answerItem"

declare namespace answerForm {
  type Props = Readonly<{
    props: {
      projectId: string
      formId: string
      items: FormAnswerItemInForm[]
    }
    idToken: string
  }>
}

const answerForm = async ({
  props: { projectId, formId, items },
  idToken,
}: answerForm.Props): Promise<{ form: Form }> => {
  return client({ idToken })
    .post("project/form/answer", {
      json: {
        project_id: projectId,
        form_id: formId,
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
}

export { answerForm }
