import type { Form } from "../../../types/models/form/"
import { client } from "../client"

declare namespace getProjectForm {
  type Props = Readonly<{
    props: {
      projectId: string
      formId: string
    }
    idToken: string
  }>
}

const getProjectForm = async ({
  props: { projectId, formId },
  idToken,
}: getProjectForm.Props): Promise<{ form: Form }> => {
  return client({ idToken })
    .get("project/form/get", {
      searchParams: {
        project_id: projectId,
        form_id: formId,
      },
    })
    .json()
}

export { getProjectForm }
