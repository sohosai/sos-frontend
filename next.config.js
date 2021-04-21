const withTM = require("next-transpile-modules")(["ky"])

const { createSecureHeaders } = require("next-secure-headers")

module.exports = withTM({
  reactStrictMode: true,
  future: {
    webpack5: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }]
  },
})
