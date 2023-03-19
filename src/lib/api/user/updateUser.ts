import { HTTPError, TimeoutError } from "ky"

import { client } from "../client"
import { User, UserId } from "src/types/models/user"
import { UserRole } from "src/types/models/user/userRole"

declare namespace updateUser {
  type Props = Readonly<{
    props: {
      id: UserId
      role: UserRole
    }
    idToken: string
  }>
}

const updateUser = async ({
  props,
  idToken,
}: updateUser.Props): Promise<
  | { user: User }
  | {
      errorCode: "userNotFound" | "timeout"
      error?: any
    }
> => {
  if (!idToken) throw new Error("IDTOKEN_UNDEFINED")

  try {
    const { user } = await client({ idToken })
      .post("user/update", {
        json: props,
      })
      .json()
    return { user }
  } catch (err) {
    if (err instanceof HTTPError) {
      const body = await err.response.json()

      switch (body.error?.info?.type) {
        case "USER_NOT_FOUND":
          return { errorCode: "userNotFound", error: body.error }
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

export { updateUser }
