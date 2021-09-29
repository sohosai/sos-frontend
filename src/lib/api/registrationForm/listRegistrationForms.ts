import { client } from "../client"

import type { RegistrationForm } from "src/types/models/registrationForm"

declare namespace listRegistrationForms {
  type Props = {
    idToken: string
  }
}

const listRegistrationForms = async ({
  idToken,
}: listRegistrationForms.Props): Promise<{
  registrationForms: Array<RegistrationForm>
}> => {
  try {
    const { registration_forms }: { registration_forms: RegistrationForm[] } =
      await client({ idToken }).get("registration-form/list").json()
    return {
      registrationForms: registration_forms,
    }
  } catch (err) {
    // FIXME: any
    const body = await (err as any).response?.json()
    throw body ?? err
  }
}

export { listRegistrationForms }
