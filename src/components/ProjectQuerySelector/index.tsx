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
            checked={checked.general}
            label={projectCategoryToUiText("general")}
            register={registers?.general}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.cooking_requiring_preparation_area}
            label={projectCategoryToUiText(
              "cooking_requiring_preparation_area"
            )}
            register={registers?.cooking_requiring_preparation_area}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.cooking}
            label={projectCategoryToUiText("cooking")}
            register={registers?.cooking}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.food}
            label={projectCategoryToUiText("food")}
            register={registers?.food}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.stage}
            label={projectCategoryToUiText("stage")}
            register={registers?.stage}
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
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.outdoor}
            label="屋外企画"
            register={registers?.outdoor}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.indoor}
            label="屋内企画"
            register={registers?.indoor}
          />
        </div>
      </div>
    </div>
  )
}

export { ProjectQuerySelector }
