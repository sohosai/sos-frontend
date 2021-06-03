import { setUser } from "@sentry/react"
import type { User } from "@sentry/react"

export const setErrorTrackerUser = (user: User): void => {
  setUser(user)
}
