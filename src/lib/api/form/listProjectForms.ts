import { client } from "../client"

import type { Form } from "../../../types/models/form/"

declare namespace listProjectForms {
  type Props = Readonly<{
    props: {
      project_id: string
    }
    idToken: string
  }>
}

const listProjectForms = async ({
  props: { project_id },
  idToken,
}: listProjectForms.Props): Promise<{
  forms: Array<{ has_answer: true } & Form>
}> => {
  return client({ idToken })
    .get("project/form/list", {
      searchParams: {
        project_id,
      },
    })
    .json()
}

export { listProjectForms }
