import ky, { Options } from "ky"

export const client = ({ idToken }: { idToken?: string }): typeof ky => {
  const options: Options = {
    prefixUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  }

  // ちょっと気持ち悪いが妥協
  if (idToken) {
    options.headers = {
      Authorization: `Bearer ${idToken}`,
    }
  }

  return ky.create(options)
}
