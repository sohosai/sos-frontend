/// <reference types="node" />
/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_DEPLOY_ENV: "dev" | "staging" | "production"
    /**
     * like `http://localhost:3131/`
     */
    readonly NEXT_PUBLIC_FRONTEND_URL: string
    /**
     * like `http://localhost:3000/`
     */
    readonly NEXT_PUBLIC_BACKEND_BASE_URL: string

    readonly NEXT_PUBLIC_FIREBASE_API_KEY: string
    readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
    readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
    readonly NEXT_PUBLIC_FIREBASE_APP_ID: string
  }
}
