import { FC } from "react"
import styles from "./index.module.scss"
import { Tooltip } from "src/components"
import {
  ProjectAttribute,
  projectAttributeToUiText,
} from "src/types/models/project"

declare namespace ProjectAttributeChips {
  type Props = {
    attributes:
      | ProjectAttribute[]
      | {
          [attribute in ProjectAttribute]: boolean
        }
  }
}

const projectAttributes: ProjectAttribute[] = [
  "academic",
  "artistic",
  "outdoor",
  "indoor",
  "committee",
]

const projectAttributeCode: {
  [attribute in ProjectAttribute]: string
} = {
  academic: "学",
  artistic: "芸",
  outdoor: "外",
  indoor: "内",
  committee: "委",
}

const ProjectAttributeChips: FC<ProjectAttributeChips.Props> = ({
  attributes,
}) => {
  return (
    <div className={styles.wrapper}>
      {projectAttributes.map((attribute) => (
        <Tooltip
          title={projectAttributeToUiText({
            projectAttribute: attribute,
          })}
          key={attribute}
        >
          <p
            className={styles.projectAttributeCode}
            data-active={
              Array.isArray(attributes)
                ? attributes.includes(attribute)
                : attributes[attribute]
            }
          >
            {projectAttributeCode[attribute]}
          </p>
        </Tooltip>
      ))}
    </div>
  )
}

export { ProjectAttributeChips }
