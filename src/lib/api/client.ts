import ky from "ky"

export const client = ({
  idToken = undefined,
}: {
  idToken?: string
}): typeof ky =>
  ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    headers: {
      Authorization: idToken ? `Bearer ${idToken}` : "",
    },
  })
