import { PageFC } from "next"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

import { getProjectForm } from "../../../lib/api/form/getProjectForm"
import { Form, FormAnswer } from "../../../types/models/form"
import styles from "./answer.module.scss"
import { FormItemSpacer, Head, Panel, Paragraph, Spinner } from "src/components"
import {
  AnsweredCheckboxFormItem,
  AnsweredFileFormItem,
  AnsweredRadioFormItem,
  AnsweredTextFormItem,
} from "src/components/AnsweredFormItem"
import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { getProjectFormAnswerSharedFile } from "src/lib/api/file/getProjectFormAnswerSharedFile"
import { getProjectFormAnswer } from "src/lib/api/formAnswer/getProjectFormAnswer"

export type Query = {
  formId: string
}

type SharedFile = {
  sharingId: string
  file: File
}

const FormAnswerDetails: PageFC = () => {
  const [form, setForm] = useState<Form>()
  const [formAnswer, setFormAnswer] = useState<FormAnswer>()
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([])
  const [generalError, setGeneralError] = useState<
    | "formIdNotFound"
    | "formNotFound"
    | "projectNotFound"
    | "formAnswerNotFound"
    | "projectPending"
    | "unknown"
  >()

  const router = useRouter()

  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()
  const { addToast } = useToastDispatcher()

  useEffect(() => {
    ;(async () => {
      setGeneralError(undefined)

      const { formId } = router.query as Query
      if (!formId) {
        setGeneralError("formIdNotFound")
        return
      }

      if (authState?.status !== "bothSignedIn") return

      if (myProjectState?.isPending !== false) {
        setGeneralError("projectPending")
        return
      }

      const projectId = myProjectState.myProject.id
      const idToken = await authState.firebaseUser.getIdToken()

      try {
        const { form: fetchedForm } = await getProjectForm({
          props: {
            projectId,
            formId,
          },
          idToken,
        })

        const { answer: fetchedAnswer } = await getProjectFormAnswer({
          props: {
            projectId,
            formId,
          },
          idToken,
        })

        fetchedAnswer.items.map((item) => {
          if (item.type !== "file") return

          const sharingIdsArray = item.answer
          sharingIdsArray.map(async (sharingId) => {
            const fetchedFile = await getProjectFormAnswerSharedFile({
              props: {
                sharingId,
                projectId: myProjectState.myProject.id,
                formId: fetchedForm.id,
              },
              idToken,
            })
            if ("errorCode" in fetchedFile || !fetchedFile.filename) return
            const file = new File([fetchedFile.blob], fetchedFile.filename, {
              type: fetchedFile.blob.type,
            })
            setSharedFiles((sharedFiles) => [
              ...sharedFiles,
              {
                sharingId,
                file,
              },
            ])
          })
        })

        setForm(fetchedForm)
        setFormAnswer(fetchedAnswer)
      } catch (err) {
        // FIXME: any
        if ((err as any)?.error?.info?.type === "FORM_NOT_FOUND") {
          setGeneralError("formNotFound")
          addToast({ title: "申請が見つかりませんでした", kind: "error" })
          return
        }

        if ((err as any)?.error?.info?.type === "PROJECT_NOT_FOUND") {
          setGeneralError("projectNotFound")
          addToast({ title: "企画が見つかりませんでした", kind: "error" })
          return
        }

        if ((err as any)?.error?.info?.type === "FORM_ANSWER_NOT_FOUND") {
          setGeneralError("formAnswerNotFound")
          addToast({ title: "申請の回答が見つかりませんでした", kind: "error" })
          return
        }

        setGeneralError("unknown")
        addToast({ title: "エラーが発生しました", kind: "error" })
        throw err
      }
    })()
  }, [authState, myProjectState, router.query])

  return (
    <div className={styles.wrapper}>
      <Head title={form?.name ?? "回答内容の確認"} />
      <h1 className={styles.title}>回答内容の確認</h1>
      {form && !generalError ? (
        <>
          <div className={styles.formGeneralInfoWrapper}>
            <Panel>
              <h2 className={styles.formName}>{form.name}</h2>
              {form.description && (
                <Paragraph
                  text={form.description}
                  normalTextClassName={styles.formDescription}
                />
              )}
            </Panel>
          </div>
          <Panel>
            <div className={styles.formItems}>
              {form.items.map((formItem) => (
                <FormItemSpacer key={formItem.id}>
                  {(() => {
                    if (formItem.type === "text") {
                      const answer = formAnswer?.items.find(
                        (item) => item.item_id === formItem.id
                      )
                      if (answer?.type !== "text") return

                      return (
                        <AnsweredTextFormItem
                          formItem={formItem}
                          answer={answer.answer}
                        />
                      )
                    }

                    if (formItem.type === "checkbox") {
                      const answer = formAnswer?.items.find(
                        (item) => item.item_id === formItem.id
                      )
                      if (answer?.type !== "checkbox") return

                      return (
                        <AnsweredCheckboxFormItem
                          formItem={formItem}
                          checkedItemList={answer.answer}
                        />
                      )
                    }

                    if (formItem.type === "radio") {
                      const answer = formAnswer?.items.find(
                        (item) => item.item_id === formItem.id
                      )
                      if (answer?.type !== "radio") return
                      const selectedAnswer = formItem.buttons.find(
                        (item) => item.id === answer.answer
                      )
                      return (
                        <AnsweredRadioFormItem
                          formItem={formItem}
                          selectedAnswer={selectedAnswer}
                        />
                      )
                    }

                    if (formItem.type === "file") {
                      const answer = formAnswer?.items.find(
                        (item) => item.item_id === formItem.id
                      )
                      if (answer?.type !== "file") return
                      const fileList: File[] = []
                      answer.answer.map((sharingId) => {
                        const file = sharedFiles.find(
                          (f) => f.sharingId === sharingId
                        )
                        if (file) fileList.push(file.file)
                      })
                      return (
                        <AnsweredFileFormItem
                          formItem={formItem}
                          files={fileList}
                        />
                      )
                    }
                  })()}
                </FormItemSpacer>
              ))}
            </div>
          </Panel>
        </>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            {(() => {
              if (generalError === "projectPending")
                return <p>企画応募を完了してください</p>

              if (
                generalError === "formIdNotFound" ||
                generalError === "formNotFound"
              )
                return <p>お探しの申請が見つかりませんでした</p>

              if (generalError === "projectNotFound")
                return <p>お探しの企画が見つかりませんでした</p>

              if (generalError === "formAnswerNotFound")
                return <p>申請への回答が見つかりませんでした</p>

              if (generalError === "unknown")
                return <p>不明なエラーが発生しました</p>

              return <Spinner />
            })()}
          </div>
        </Panel>
      )}
    </div>
  )
}
FormAnswerDetails.layout = "default"
FormAnswerDetails.rbpac = { type: "higherThanIncluding", role: "general" }

export default FormAnswerDetails
