import { client } from "../client"

import type { User } from "../../../types/models/user"

declare namespace getUser {
  type Props = Readonly<{
    userId: string
    idToken: string
  }>
}

const getUser = async ({
  userId,
  idToken,
}: getUser.Props): Promise<{ user: User }> => {
  try {
    const { user } = await client({ idToken })
      .get("user/get", {
        searchParams: {
          user_id: userId,
        },
      })
      .json()
    return { user }
  } catch (err) {
    const body = await err.response?.json()
    throw body ?? err
  }
}

export { getUser }
