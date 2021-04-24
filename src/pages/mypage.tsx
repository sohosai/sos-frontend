import type { PageFC } from "next"

import { useAuthNeue } from "../contexts/auth"

const Mypage: PageFC = () => {
  const { authState } = useAuthNeue()

  if (authState?.sosUser) {
    console.log(authState.sosUser)
  }

  return <></>
}
Mypage.layout = "default"
Mypage.rbpac = { type: "higherThanIncluding", role: "general" }

export default Mypage
