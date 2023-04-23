import { client } from "../client"

import type { RegistrationForm } from "src/types/models/registrationForm"

declare namespace getRegistrationForm {
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

const getRegistrationForm = async ({
  projectId,
  pendingProjectId,
  registrationFormId,
  idToken,
}: getRegistrationForm.Props): Promise<{
  registrationForm: RegistrationForm
}> => {
  if (projectId) {
    try {
      const { registration_form } = await client({ idToken })
        .get("project/registration-form/get", {
          searchParams: {
            project_id: projectId,
            registration_form_id: registrationFormId,
          },
        })
        .json()
      return { registrationForm: registration_form }
    } catch (error) {
      // FIXME: any
      const body = await (error as any).response?.json()
      throw body ?? error
    }
  }

  if (pendingProjectId) {
    try {
      const { registration_form } = await client({ idToken })
        .get("pending-project/registration-form/get", {
          searchParams: {
            pending_project_id: pendingProjectId,
            registration_form_id: registrationFormId,
          },
        })
        .json()
      return { registrationForm: registration_form }
    } catch (error) {
      // FIXME: any
      const body = await (error as any).response?.json()
      throw body ?? error
    }
  }

  throw new Error("Either of projectId or pendingProjectId needed.")
}

export { getRegistrationForm }
