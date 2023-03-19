import type { FormAnswer } from "../../../types/models/form"
import { client } from "../client"

declare namespace getProjectFormAnswer {
  type Props = Readonly<{
    props: {
      projectId: string
      formId: string
    }
    idToken: string
  }>
}

const getProjectFormAnswer = async ({
  props: { projectId, formId },
  idToken,
}: getProjectFormAnswer.Props): Promise<{ answer: FormAnswer }> => {
  return client({ idToken })
    .get("project/form/answer/get", {
      searchParams: {
        project_id: projectId,
        form_id: formId,
      },
    })
    .json()
}

export { getProjectFormAnswer }
