import { useState, useEffect, FC } from "react"

import type { PageFC } from "next"
import Link from "next/link"

import { listProjectForms } from "../../../lib/api/form/listProjectForms"

import { Form } from "../../../types/models/form"

import { useAuthNeue } from "../../../contexts/auth"
import { useMyProject } from "../../../contexts/myProject"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import { Head, Panel, Spinner } from "../../../components"

import { pagesPath } from "../../../utils/$path"

import styles from "./index.module.scss"

type FormWithHasAnswerFlag = Form & { has_answer: boolean }

type FormRowProps = {
  form: FormWithHasAnswerFlag
  outOfAnswerPeriod?: boolean
}

const FormRow: FC<FormRowProps> = ({ form, outOfAnswerPeriod = false }) => {
  const answerable = !outOfAnswerPeriod && form.has_answer === false

  const FormRowInner: FC = () => (
    <Panel
      style={{
        paddingTop: "16px",
        paddingBottom: "16px",
      }}
      hoverStyle={answerable ? "gray" : "none"}
    >
      <div className={styles.formRowInner}>
        <p className={styles.formName} title={form.name}>
          {form.name}
        </p>
        <p className={styles.formDate}>
          {dayjs.tz(form.starts_at, "Asia/Tokyo").format("M/D HH:mm")}
          <i className={`jam-icons jam-arrow-right ${styles.formDateIcon}`} />
          {dayjs.tz(form.ends_at, "Asia/Tokyo").format("M/D HH:mm")}
        </p>
        <div className={styles.formAnsweredStateWrapper}>
          <p className={styles.formAnsweredState}>
            {form.has_answer ? "回答済み" : "未回答"}
          </p>
        </div>
      </div>
    </Panel>
  )

  return (
    <div className={styles.formRowWrapper} key={form.id}>
      {answerable ? (
        <Link
          href={pagesPath.project.form.answer.$url({
            query: { formId: form.id },
          })}
        >
          <a>
            <FormRowInner />
          </a>
        </Link>
      ) : (
        <FormRowInner />
      )}
    </div>
  )
}

const ListProjectForms: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()

  const [answerableForms, setAnswerableForms] = useState<
    FormWithHasAnswerFlag[] | undefined
  >()
  const [notAnswerableForms, setNotAnswerableForms] = useState<
    FormWithHasAnswerFlag[] | undefined
  >()
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

        const newAnswerableForms = fetchedForms.filter(
          ({ starts_at, ends_at }) =>
            dayjs().isBefore(dayjs.tz(starts_at, "Asia/Tokyo")) ||
            dayjs().isAfter(dayjs.tz(ends_at, "Asia/Tokyo"))
        )
        setNotAnswerableForms(
          newAnswerableForms.sort(({ ends_at: a }, { ends_at: b }) => a - b)
        )
        setAnswerableForms(
          fetchedForms
            .filter(
              ({ id }) =>
                !newAnswerableForms.some(
                  ({ id: answerableFormId }) => id === answerableFormId
                )
            )
            .sort(({ ends_at: a }, { ends_at: b }) => a - b)
        )
      } catch (err) {
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
      <Head title="申請一覧" />
      <h1 className={styles.title}>申請一覧</h1>
      <div className={styles.panelWrapper}>
        {answerableForms && notAnswerableForms ? (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>回答受付中</h2>
              {answerableForms.length ? (
                <>
                  {answerableForms.map((form) => (
                    <FormRow form={form} key={form.id} />
                  ))}
                </>
              ) : (
                <>
                  <Panel>
                    <div className={styles.emptyFormsWrapper}>
                      <p>申請がありません</p>
                    </div>
                  </Panel>
                </>
              )}
            </section>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>回答期間外</h2>
              {notAnswerableForms.length ? (
                <>
                  {notAnswerableForms.map((form) => (
                    <FormRow form={form} key={form.id} outOfAnswerPeriod />
                  ))}
                </>
              ) : (
                <>
                  <Panel>
                    <div className={styles.emptyFormsWrapper}>
                      <p>申請がありません</p>
                    </div>
                  </Panel>
                </>
              )}
            </section>
          </>
        ) : (
          <Panel>
            <div className={styles.emptyWrapper}>
              {(() => {
                if (error === "projectNotFound" || error === "unknown")
                  return <p>エラーが発生しました</p>

                if (error === "projectPending")
                  return <p>企画応募を完了してください</p>

                if (myProjectState && !myProjectState.myProject)
                  return (
                    <p>責任者または副責任者となっている企画が存在しません</p>
                  )

                if (answerableForms?.length === 0) {
                  return <p>申請がありません</p>
                }

                return <Spinner />
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
