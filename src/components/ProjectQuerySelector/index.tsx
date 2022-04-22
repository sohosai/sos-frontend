import { FC } from "react"

import type { UseFormRegisterReturn } from "react-hook-form"

import { Checkbox } from "../"
import {
  ProjectCategory,
  ProjectAttribute,
  projectCategoryToUiText,
} from "../../types/models/project"

import { Dropdown } from "../Dropdown"
import styles from "./index.module.scss"

declare namespace ProjectQuerySelector {
  type Props = Readonly<{
    checked: {
      [key in ProjectCategory | ProjectAttribute]: boolean
    }
    registers?: {
      [key in ProjectCategory | ProjectAttribute]: UseFormRegisterReturn
    } & { attributesAndOr: UseFormRegisterReturn }
  }>
}

const ProjectQuerySelector: FC<ProjectQuerySelector.Props> = ({
  checked,
  registers,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.selectorsWrapper}>
        <p className={styles.selectorsTitle}>企画区分</p>
        <p className={styles.selectorsDescription}>
          選択しない場合全ての企画が対象となります
        </p>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.general_physical}
            label={projectCategoryToUiText("general_physical")}
            register={registers?.general_physical}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.general_online}
            label={projectCategoryToUiText("general_online")}
            register={registers?.general_online}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.stage_physical}
            label={projectCategoryToUiText("stage_physical")}
            register={registers?.stage_physical}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.stage_online}
            label={projectCategoryToUiText("stage_online")}
            register={registers?.stage_online}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.food_physical}
            label={projectCategoryToUiText("food_physical")}
            register={registers?.food_physical}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.cooking_physical}
            label={projectCategoryToUiText("cooking_physical")}
            register={registers?.cooking_physical}
          />
        </div>
      </div>
      <div className={styles.selectorsWrapper}>
        <p className={styles.selectorsTitle}>企画属性</p>
        <p className={styles.selectorsDescription}>
          選択しない場合全ての企画が対象となります
        </p>
        <div className={styles.attributesAndOrWrapper}>
          <Dropdown
            options={[
              { value: "or", label: "いずれかを満たす" },
              { value: "and", label: "すべて満たす" },
            ]}
            fullWidth={false}
            register={registers?.attributesAndOr}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.academic}
            label="学術参加枠"
            register={registers?.academic}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.artistic}
            label="芸術祭参加枠"
            register={registers?.artistic}
          />
        </div>
      </div>
    </div>
  )
}

export { ProjectQuerySelector }
