import type { User } from "../../../types/models/user"
import { client } from "../client"

declare namespace getMe {
  type Props = Readonly<{
    idToken: string
  }>
}

const getMe = async ({ idToken }: getMe.Props): Promise<{ user: User }> => {
  if (!idToken) throw new Error("IDTOKEN_UNDEFINED")

  return client({ idToken }).get("me/get").json()
}

export { getMe }
