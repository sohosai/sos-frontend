const withTM = require("next-transpile-modules")(["ky"])
const { withSentryConfig } = require("@sentry/nextjs")

const { createSecureHeaders } = require("next-secure-headers")

if (
  !process.env.NEXT_PUBLIC_DEPLOY_ENV ||
  !["dev", "staging", "production"].includes(process.env.NEXT_PUBLIC_DEPLOY_ENV)
) {
  throw new Error("Invalid NEXT_PUBLIC_DEPLOY_ENV")
}

if (
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_FIREBASE_APP_ID
) {
  throw new Error("Firebase config needed.")
}

if (
  process.env.NEXT_PUBLIC_DEPLOY_ENV !== "dev" &&
  (!process.env.NEXT_PUBLIC_SENTRY_DSN ||
    !process.env.SENTRY_URL ||
    !process.env.SENTRY_ORG ||
    !process.env.SENTRY_PROJECT ||
    !process.env.SENTRY_AUTH_TOKEN)
) {
  throw new Error("Sentry config needed in deploy env other than dev.")
}

if (!process.env.NEXT_PUBLIC_FRONTEND_URL) {
  throw new Error("NEXT_PUBLIC_FRONTEND_URL env variable needed.")
}

if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_BASE_URL env variable needed.")
}

if (!/^https?:\/\/.+\/$/.test(process.env.NEXT_PUBLIC_FRONTEND_URL)) {
  throw new Error("NEXT_PUBLIC_FRONTEND_URL env variable has a wrong format.")
}

/** @type {import('next/dist/next-server/server/config-shared').NextConfig} */
const config = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }]
  },
}

module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(withTM(config))
  : withTM(config)
