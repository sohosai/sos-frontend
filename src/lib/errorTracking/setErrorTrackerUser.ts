import { setUser } from "@sentry/react"
import type { User } from "@sentry/react"

export const setErrorTrackerUser = (user: User | null): void => {
  setUser(user)
}
