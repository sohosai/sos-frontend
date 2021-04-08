import { client } from "../client"

import type { User } from "../../../types/models/user"

declare namespace listUsers {
  type Props = Readonly<{
    idToken: string
  }>
}

const listUsers = async ({
  idToken,
}: listUsers.Props): Promise<{ users: User[] }> => {
  return client({ idToken }).get("user/list").json()
}

export { listUsers }
