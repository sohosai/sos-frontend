import { client } from "../client"

export const healthCheck = async (): Promise<Response> => {
  return client({}).get("meta/health/check")
}

export const checkLiveness = async (): Promise<Response> => {
  return client({}).get("meta/health/check-liveness")
}

export type BuildInfo = Readonly<{
  version: string
  profile: string
  out?: string
  git: {
    commit: string
    version: string
    branch: string
  }
}>

export const getBuildInfo = async (): Promise<BuildInfo> => {
  return client({}).get("meta/get-build-info").json()
}
