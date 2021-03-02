const { createSecureHeaders } = require("next-secure-headers")

module.exports = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }]
  },
}
