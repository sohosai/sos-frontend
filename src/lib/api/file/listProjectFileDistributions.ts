import type { DistributedFile } from "../../../types/models/files"
import { client } from "../client"

declare namespace listProjectFileDistributions {
  type Props = Readonly<{
    props: {
      projectId: string
    }
    idToken: string
  }>
}

const listProjectFileDistributions = async ({
  props: { projectId },
  idToken,
}: listProjectFileDistributions.Props): Promise<DistributedFile[]> => {
  try {
    const { distributed_files } = await client({ idToken })
      .get("project/file-distribution/list", {
        searchParams: {
          project_id: projectId,
        },
      })
      .json()
    return distributed_files
  } catch (err) {
    const body = await err.response?.json()
    throw body ?? err
  }
}

export { listProjectFileDistributions }
