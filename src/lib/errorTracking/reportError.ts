import { captureException } from "@sentry/browser"

/**
 * @returns The generated eventId
 */
export const reportError = (message: string, data?: any): string => {
  if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "dev") {
    console.error({
      message,
      ...data,
    })
  }

  return captureException(new Error(message), { extra: data })
}
