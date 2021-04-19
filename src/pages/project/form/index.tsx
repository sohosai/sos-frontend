import { useState, useEffect } from "react"

import type { PageFC } from "next"

import { listProjectForms } from "../../../lib/api/form/listProjectForms"

import { Form } from "../../../types/models/form"

import { useAuthNeue } from "../../../contexts/auth"
import { useMyProject } from "../../../contexts/myProject"

import { Panel, Spinner } from "../../../components"

import styles from "./index.module.scss"

const ListProjectForms: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()

  const [forms, setForms] = useState<Form[] | null | undefined>(null)
  const [error, setError] = useState<
    "unknown" | "projectPending" | "projectNotFound" | null
  >(null)

  useEffect(() => {
    ;(async () => {
      if (authState === null || authState.firebaseUser == null) return
      if (myProjectState === null) return
      if (myProjectState.error) {
        setError("unknown")
      }
      if (myProjectState.myProject === null) {
        setError("projectNotFound")
        return
      }
      if (myProjectState.isPending) {
        setError("projectPending")
        return
      }

      const idToken = await authState.firebaseUser.getIdToken()

      try {
        const { forms: fetchedForms } = await listProjectForms({
          props: {
            project_id: myProjectState.myProject.id,
          },
          idToken,
        })
        console.log(fetchedForms)
        setForms(fetchedForms)
      } catch (err) {
        setForms(undefined)
        setError("unknown")
        const body = await err.response?.json()
        throw body ?? err
      }
    })()
  }, [authState, myProjectState])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>申請一覧</h1>
      <div className={styles.panelWrapper}>
        {forms?.length ? (
          <>
            <p>申請一覧</p>
          </>
        ) : (
          <Panel>
            <div className={styles.emptyWrapper}>
              {(() => {
                if (error === "projectNotFound" || error === "unknown")
                  return <p>エラーが発生しました</p>

                if (error === "projectPending")
                  return <p>副責任者の登録を完了してください</p>

                if (myProjectState && !myProjectState.myProject)
                  return (
                    <p>責任者または副責任者となっている企画が存在しません</p>
                  )

                if (forms === null) return <Spinner />
              })()}
            </div>
          </Panel>
        )}
      </div>
    </div>
  )
}
ListProjectForms.layout = "default"
ListProjectForms.rbpac = { type: "higherThanIncluding", role: "general" }

export default ListProjectForms
