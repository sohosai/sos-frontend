import { ProjectCreationAvailability } from "../../types/models/projectCreationAvailability"
import { client } from "./client"
import { ProjectCategory } from "src/types/models/project"

const getProjectCreationAvailability = async (): Promise<{
  project_creation_availability: ProjectCreationAvailability
}> => {
  return client({ idToken: undefined })
    .get("get-project-creation-availability")
    .json()
}

const isInProjectCreationPeriod = (category: ProjectCategory) => {
  if (
    process.env.NEXT_PUBLIC_DEPLOY_ENV === "dev" ||
    process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging"
  ) {
    return true
  }

  getProjectCreationAvailability().then((res) => {
    return res.project_creation_availability[category]
  })
}

// NOTE: It is only valid under a provisional assumption that project creation periods are identical for all categories
const IN_PROJECT_CREATION_PERIOD = isInProjectCreationPeriod("general_online")

export { getProjectCreationAvailability, IN_PROJECT_CREATION_PERIOD }
