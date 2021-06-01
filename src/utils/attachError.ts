import { addBreadcrumb, Breadcrumb } from "@sentry/browser"

export const attachError = (error: Breadcrumb): void => {
  addBreadcrumb(error)
}
