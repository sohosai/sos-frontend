import type { PageFC } from "next"

import { useAuth } from "../../../contexts/auth"

import { listUsers } from "../../../lib/api/user/listUsers"

const ListUsers: PageFC = () => {
  const { idToken } = useAuth()

  if (idToken) {
    listUsers({ idToken })
      .then(({ users }) => console.log(users))
      .catch(async (e) => {
        const body = await e.response.json()
        throw body
      })
  }

  return <></>
}
ListUsers.layout = "committee"
ListUsers.rbpac = { type: "higherThanIncluding", role: "committee_operator" }

export default ListUsers
