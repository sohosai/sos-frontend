import { client } from "../client"

import type { RegistrationForm } from "src/types/models/registrationForm"

declare namespace listMyRegistrationForms {
  type Props =
    | Readonly<{
        projectId: string
        pendingProjectId?: undefined
        idToken: string
      }>
    | Readonly<{
        projectId?: undefined
        pendingProjectId: string
        idToken: string
      }>
}

const listMyRegistrationForms = async ({
  projectId,
  pendingProjectId,
  idToken,
}: listMyRegistrationForms.Props): Promise<{
  registrationForms: RegistrationForm[]
}> => {
  if (projectId) {
    try {
      const { registration_forms } = await client({ idToken })
        .get("project/registration-form/list", {
          searchParams: {
            project_id: projectId,
          },
        })
        .json()
      return { registrationForms: registration_forms }
    } catch (err) {
      const body = await err.response?.json()
      throw body ?? err
    }
  }

  if (pendingProjectId) {
    try {
      const { registration_forms } = await client({ idToken })
        .get("pending-project/registration-form/list", {
          searchParams: {
            pending_project_id: pendingProjectId,
          },
        })
        .json()
      return { registrationForms: registration_forms }
    } catch (err) {
      const body = await err.response?.json()
      throw body ?? err
    }
  }

  throw new Error("Either of projectId or pendingProjectId needed.")
}

export { listMyRegistrationForms }
