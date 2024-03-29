import ky from "ky"

export const client = ({ idToken }: { idToken?: string }): typeof ky => {
  return ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    timeout: 60000,
    headers: {
      ...(idToken && { Authorization: `Bearer ${idToken}` }),
    },
  })
}
