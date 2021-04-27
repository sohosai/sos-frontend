const withTM = require("next-transpile-modules")(["ky"])

const { createSecureHeaders } = require("next-secure-headers")

/** @type {import('next/dist/next-server/server/config-shared').NextConfig} */
const config = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }]
  },
}

module.exports = withTM(config)
