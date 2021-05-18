import { FC } from "react"

import type { UseFormRegisterReturn } from "react-hook-form"

import type {
  ProjectCategory,
  ProjectAttribute,
} from "../../types/models/project"

import { Checkbox } from "../"

import styles from "./index.module.scss"
import { Dropdown } from "../Dropdown"

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
    <>
      <div className={styles.selectorsWrapper}>
        <p className={styles.selectorsTitle}>企画区分</p>
        <p className={styles.selectorsDescription}>
          選択しない場合全ての企画が対象となります
        </p>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.general}
            label="一般企画"
            register={registers?.general}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.stage}
            label="ステージ企画"
            register={registers?.stage}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.cooking}
            label="調理企画"
            register={registers?.cooking}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={checked.food}
            label="飲食物取扱企画"
            register={registers?.food}
          />
        </div>
      </div>
      <div className={styles.selectorsWrapper}>
        <p className={styles.selectorsTitle}>
          {/* TODO: これで良いか検討 */}
          企画属性
        </p>
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
            checked={checked.committee}
            label="委員会企画"
            register={registers?.committee}
          />
        </div>
      </div>
    </>
  )
}

export { ProjectQuerySelector }
