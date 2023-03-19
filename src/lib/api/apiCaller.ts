import { HTTPError } from "ky"

import { client } from "./client"

declare namespace apiCaller {
  type Props = Readonly<{
    method: "get" | "post"
    endpoint: string
    query: string
    idToken: string
  }>
}

const apiCaller = async ({
  method,
  endpoint,
  query,
  idToken,
}: apiCaller.Props): Promise<any> => {
  if (!idToken) throw new Error("IDTOKEN_UNDEFINED")

  try {
    if (method === "get" && query === "{}")
      return client({ idToken }).get(endpoint).json()

    const jsonQuery = JSON.parse(query)

    if (method === "get") {
      return client({ idToken })
        .get(endpoint, {
          searchParams: {
            ...jsonQuery,
          },
        })
        .json()
    } else {
      return client({ idToken })
        .post(endpoint, {
          json: jsonQuery,
        })
        .json()
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      throw await err.response.json()
    }
    throw err
  }
}

export { apiCaller }
