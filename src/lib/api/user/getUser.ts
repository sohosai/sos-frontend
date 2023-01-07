import type { User } from "../../../types/models/user"
import { client } from "../client"

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
    // FIXME: any
    const body = await (err as any).response?.json()
    throw body ?? err
  }
}

export { getUser }