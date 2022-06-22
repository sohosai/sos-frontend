import { ProjectCreationAvailability } from "../../types/models/projectCreationAvailability"
import { client } from "./client"
import { ProjectCategory } from "src/types/models/project"

const getProjectCreationAvailability = async (): Promise<{
  projectCreationAvailability: ProjectCreationAvailability
}> => {
  return client({ idToken: undefined })
    .get("get-project-creation-availability")
    .json()
}

const isInProjectCreationPeriod = async (category: ProjectCategory) => {
  if (
    process.env.NEXT_PUBLIC_DEPLOY_ENV === "dev" ||
    process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging"
  ) {
    return true
  }

  const res = await getProjectCreationAvailability()
  return res.projectCreationAvailability
    ? res.projectCreationAvailability[category]
    : false
}

// NOTE: It is only valid under a provisional assumption that project creation periods are identical for all categories
const IN_PROJECT_CREATION_PERIOD = isInProjectCreationPeriod("general_online")

export { getProjectCreationAvailability, IN_PROJECT_CREATION_PERIOD }
