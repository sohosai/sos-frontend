import { client } from "./client"

import type { User } from "../../types/models/user"

declare namespace signup {
  type Props = Readonly<{
    props: Omit<User, "id" | "created_at" | "email" | "role">
    idToken: string
  }>
}

const signup = async ({
  props,
  idToken,
}: signup.Props): Promise<{ user: User }> => {
  if (!idToken) throw new Error("IDTOKEN_UNDEFINED")

  return client({ idToken })
    .post("signup", {
      json: props,
    })
    .json()
}

export { signup }
