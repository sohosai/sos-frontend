import { useState } from "react"

import { PageFC } from "next"

import type {
  ProjectCategory,
  ProjectAttribute,
} from "../../../types/models/project"

import { Panel, ProjectQuerySelector } from "../../../components/"

import styles from "./new.module.scss"

type ProjectQueryState = {
  [key in ProjectCategory]: boolean
} &
  { [key in ProjectAttribute]: boolean }

const NewForm: PageFC = () => {
  const [projectQueryState, setProjectQueryState] = useState<ProjectQueryState>(
    {
      general: false,
      stage: false,
      cooking: false,
      food: false,
      academic: false,
      artistic: false,
      outdoor: false,
      committee: false,
    }
  )

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>新しい申請を作成</h1>
      <Panel>
        <h2 className={styles.querySelectorTitle}>送信先の絞り込み</h2>
        <ProjectQuerySelector
          categories={{
            general: projectQueryState.general,
            stage: projectQueryState.stage,
            cooking: projectQueryState.cooking,
            food: projectQueryState.food,
          }}
          attributes={{
            academic: projectQueryState.academic,
            artistic: projectQueryState.artistic,
            outdoor: projectQueryState.outdoor,
            committee: projectQueryState.committee,
          }}
          onChange={{
            general: (e) => {
              setProjectQueryState({
                ...projectQueryState,
                general: e.target.checked,
              })
            },
            stage: (e) => {
              setProjectQueryState({
                ...projectQueryState,
                stage: e.target.checked,
              })
            },
            cooking: (e) => {
              setProjectQueryState({
                ...projectQueryState,
                cooking: e.target.checked,
              })
            },
            food: (e) => {
              setProjectQueryState({
                ...projectQueryState,
                food: e.target.checked,
              })
            },
            academic: (e) => {
              setProjectQueryState({
                ...projectQueryState,
                academic: e.target.checked,
              })
            },
            artistic: (e) => {
              setProjectQueryState({
                ...projectQueryState,
                artistic: e.target.checked,
              })
            },
            outdoor: (e) => {
              setProjectQueryState({
                ...projectQueryState,
                outdoor: e.target.checked,
              })
            },
            committee: (e) => {
              setProjectQueryState({
                ...projectQueryState,
                committee: e.target.checked,
              })
            },
          }}
        />
      </Panel>
    </div>
  )
}
NewForm.layout = "committee"
NewForm.rbpac = { type: "higherThanIncluding", role: "committee" }

export default NewForm
