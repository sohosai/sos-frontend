import type { Form } from "../../../types/models/form/"
import { client } from "../client"

declare namespace getForm {
  type Props = Readonly<{
    props: {
      formId: string
    }
    idToken: string
  }>
}

const getForm = async ({
  props: { formId },
  idToken,
}: getForm.Props): Promise<{ form: Form }> => {
  try {
    return await client({ idToken })
      .get("form/get", {
        searchParams: {
          form_id: formId,
        },
      })
      .json()
  } catch (err) {
    // FIXME: any
    const body = await (err as any).response?.json()
    throw body ?? err
  }
}

export { getForm }
