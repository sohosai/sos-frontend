import { captureException } from "@sentry/browser"

/**
 * @returns The generated eventId
 */
export const reportError = (message: string, data?: any): string => {
  return captureException(new Error(message), { extra: data })
}
