// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { CaptureConsole, ExtraErrorData } from "@sentry/integrations"
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_DEPLOY_ENV,
  normalizeDepth: 10,
  //エラーが発生していなくても謎の不具合が発生する場合が確認されたため、一時的に全てを対象に
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new CaptureConsole({ levels: ["warn", "error", "debug", "assert"] }),
    new ExtraErrorData({ depth: 50 }),
    new Sentry.Replay({
      //デフォルトはTrueだが、デバッグ用に必要だと判断
      maskAllText: false,
      blockAllMedia: true,
    }),
  ],
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
