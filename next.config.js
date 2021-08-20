const { withSentryConfig } = require("@sentry/nextjs")
const { createSecureHeaders } = require("next-secure-headers")
const withTM = require("next-transpile-modules")(["ky"])

if (
  !process.env.NEXT_PUBLIC_DEPLOY_ENV ||
  !["dev", "staging", "production"].includes(process.env.NEXT_PUBLIC_DEPLOY_ENV)
) {
  console.error("ERROR: Invalid NEXT_PUBLIC_DEPLOY_ENV")
  process.exit(1)
}

if (
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_FIREBASE_APP_ID
) {
  console.error("ERROR: Firebase config needed.")
  process.exit(1)
}

if (
  process.env.NEXT_PUBLIC_DEPLOY_ENV !== "dev" &&
  (!process.env.NEXT_PUBLIC_SENTRY_DSN ||
    !process.env.SENTRY_URL ||
    !process.env.SENTRY_ORG ||
    !process.env.SENTRY_PROJECT ||
    !process.env.SENTRY_AUTH_TOKEN)
) {
  console.error("ERROR: Sentry config needed in deploy env other than dev.")
  process.exit(1)
}

if (
  process.env.NEXT_PUBLIC_DEPLOY_ENV !== "dev" &&
  (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_TOKEN)
) {
  console.error("ERROR: Contentful config needed in deploy env other than dev.")
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_FRONTEND_URL) {
  console.error("ERROR: NEXT_PUBLIC_FRONTEND_URL env variable needed.")
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) {
  console.error("ERROR: NEXT_PUBLIC_BACKEND_BASE_URL env variable needed.")
  process.exit(1)
}

if (!/^https?:\/\/.+\/$/.test(process.env.NEXT_PUBLIC_FRONTEND_URL)) {
  console.error(
    "ERROR: NEXT_PUBLIC_FRONTEND_URL env variable has a wrong format."
  )
  process.exit(1)
}

/** @type {import('next/dist/next-server/server/config-shared').NextConfig} */
const config = {
  reactStrictMode: true,
  trailingSlash: true,
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }]
  },
}

module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(withTM(config))
  : withTM(config)
