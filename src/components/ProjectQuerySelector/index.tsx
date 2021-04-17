import { ChangeEventHandler, FC } from "react"

import type {
  ProjectCategory,
  ProjectAttribute,
} from "../../types/models/project"

import { Checkbox } from "../"

import styles from "./index.module.scss"

declare namespace ProjectQuerySelector {
  type Props = Readonly<{
    categories: {
      [key in ProjectCategory]: boolean
    }
    attributes: {
      [key in ProjectAttribute]: boolean
    }
    onChange: {
      [key in ProjectCategory]: ChangeEventHandler<HTMLInputElement>
    } &
      {
        [key in ProjectAttribute]: ChangeEventHandler<HTMLInputElement>
      }
  }>
}

const ProjectQuerySelector: FC<ProjectQuerySelector.Props> = ({
  categories,
  attributes,
  onChange,
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
            checked={categories.general}
            label="一般企画"
            onChange={onChange.general}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={categories.stage}
            label="ステージ企画"
            onChange={onChange.stage}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={categories.cooking}
            label="調理企画"
            onChange={onChange.cooking}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={categories.food}
            label="飲食物取扱企画"
            onChange={onChange.food}
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
        <div className={styles.checkbox}>
          <Checkbox
            checked={attributes.academic}
            label="学術参加枠"
            onChange={onChange.academic}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={attributes.artistic}
            label="芸術祭参加枠"
            onChange={onChange.artistic}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={attributes.outdoor}
            label="屋外企画"
            onChange={onChange.outdoor}
          />
        </div>
        <div className={styles.checkbox}>
          <Checkbox
            checked={attributes.committee}
            label="委員会企画"
            onChange={onChange.committee}
          />
        </div>
      </div>
    </>
  )
}

export { ProjectQuerySelector }
