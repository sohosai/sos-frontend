import { client } from "../client"

import type { Form } from "../../../types/models/form/"
import { FormAnswerItem } from "../../../types/models/form/answerItem"

declare namespace answerForm {
  type Props = Readonly<{
    props: {
      projectId: string
      formId: string
      items: FormAnswerItem[]
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
        items,
      },
    })
    .json()
}

export { answerForm }
