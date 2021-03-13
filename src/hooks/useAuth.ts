import { useContext } from "react"

import { authContext, Auth } from "../contexts/auth"

const useAuth = (): Auth => {
  return useContext(authContext)
}

export { useAuth }
