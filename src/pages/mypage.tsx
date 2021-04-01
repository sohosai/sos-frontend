import type { PageFC } from "next"

import { useAuth } from "../contexts/auth"

const Mypage: PageFC = () => {
  const { sosUser } = useAuth()

  console.log(sosUser)

  return <></>
}
Mypage.layout = "default"
Mypage.rbpac = { type: "higherThanIncluding", role: "general" }

export default Mypage
