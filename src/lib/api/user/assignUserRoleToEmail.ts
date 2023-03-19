import { HTTPError, TimeoutError } from "ky"

import { client } from "../client"
import { UserInvitation } from "src/types/models/user/userInvitation"

declare namespace assignUserRoleToEmail {
  type Props = Readonly<{
    props: {
      email: string
      role: string
    }
    idToken: string
  }>
}

const assignUserRoleToEmail = async ({
  props,
  idToken,
}: assignUserRoleToEmail.Props): Promise<
  | { userInvitation: UserInvitation }
  | {
      errorCode: "invalidEmailAddress" | "notUniversityEmailAddress" | "timeout"
      error?: any
    }
> => {
  if (!idToken) throw new Error("IDTOKEN_UNDEFINED")

  try {
    const { userInvitation } = await client({ idToken })
      .post("assign-user-role-to-email", {
        json: props,
      })
      .json()
    return { userInvitation }
  } catch (err) {
    if (err instanceof HTTPError) {
      const body = await err.response.json()

      switch (body.error?.info?.type) {
        case "INVALID_EMAIL_ADDRESS":
          return { errorCode: "invalidEmailAddress", error: body.error }
        case "NOT_UNIVERSITY_EMAIL_ADDRESS":
          return { errorCode: "notUniversityEmailAddress", error: body.error }
        default:
          throw body
      }
    }
    if (err instanceof TimeoutError) {
      return { errorCode: "timeout", error: err }
    }
    throw err
  }
}

export { assignUserRoleToEmail }
