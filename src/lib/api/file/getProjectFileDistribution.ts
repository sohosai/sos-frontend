import { client } from "../client"

import type { DistributedFile } from "src/types/models/files"

declare namespace getProjectFileDistribution {
  type Props = Readonly<{
    props: {
      projectId: string
      distributionId: string
    }
    idToken: string
  }>
}

const getProjectFileDistribution = async ({
  props: { projectId, distributionId },
  idToken,
}: getProjectFileDistribution.Props): Promise<
  | {
      distributedFile: DistributedFile
      errorCode: null
    }
  | {
      errorCode: "notFound"
      error?: any
    }
> => {
  try {
    const { distributed_file } = await client({ idToken })
      .get("project/file-distribution/get", {
        searchParams: {
          project_id: projectId,
          distribution_id: distributionId,
        },
      })
      .json()
    return { distributedFile: distributed_file, errorCode: null }
  } catch (err) {
    // FIXME: any
    const body = await (err as any).response?.json()

    switch (body?.error?.info?.type) {
      case "FILE_DISTRIBUTION_NOT_FOUND":
        return { errorCode: "notFound", error: body }
    }

    throw body ?? err
  }
}

export { getProjectFileDistribution }
