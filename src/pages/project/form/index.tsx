import { useState, useEffect } from "react"

import type { PageFC } from "next"
import Link from "next/link"

import { listProjectForms } from "../../../lib/api/form/listProjectForms"

import { Form } from "../../../types/models/form"

import { useAuthNeue } from "../../../contexts/auth"
import { useMyProject } from "../../../contexts/myProject"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import { Panel, Spinner } from "../../../components"

import { pagesPath } from "../../../utils/$path"

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
        setForms(fetchedForms)
      } catch (err) {
        setForms(undefined)
        setError("unknown")
        const body = await err.response?.json()
        throw body ?? err
      }
    })()
  }, [authState, myProjectState])

  useEffect(() => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
  }, [])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>申請一覧</h1>
      <div className={styles.panelWrapper}>
        {forms?.length ? (
          <>
            {forms.map((form) => (
              <div className={styles.formRowWrapper} key={form.id}>
                {/* TODO: */}
                <Link
                  href={pagesPath.project.form.answer.$url({
                    query: { formId: form.id },
                  })}
                >
                  <a>
                    <Panel
                      style={{
                        paddingTop: "24px",
                        paddingBottom: "24px",
                      }}
                    >
                      <div className={styles.formRowInner}>
                        <p className={styles.formName}>{form.name}</p>
                        <p className={styles.formDate}>
                          {dayjs
                            .tz(form.starts_at, "Asia/Tokyo")
                            .format("M/D HH:mm")}
                          <i
                            className={`jam-icons jam-arrow-right ${styles.formDateIcon}`}
                          />
                          {dayjs
                            .tz(form.ends_at, "Asia/Tokyo")
                            .format("M/D HH:mm")}
                          <span className={styles.formDateState}>
                            {(() => {
                              if (
                                dayjs().isBefore(
                                  dayjs.tz(form.starts_at, "Asia/Tokyo")
                                )
                              )
                                return "開始前"

                              if (
                                dayjs().isAfter(
                                  dayjs.tz(form.ends_at, "Asia/Tokyo")
                                )
                              )
                                return "締切済"

                              return "受付中"
                            })()}
                          </span>
                        </p>
                      </div>
                    </Panel>
                  </a>
                </Link>
              </div>
            ))}
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
