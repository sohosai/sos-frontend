import { useEffect, useState } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useForm, useFieldArray } from "react-hook-form"

import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { RegistrationForm } from "src/types/models/registrationForm"
import { FormAnswerItemInForm } from "src/types/models/form/answerItem"

import { answerRegistrationForm } from "src/lib/api/registrationForm/answerRegistrationForm"
import { getRegistrationForm } from "src/lib/api/registrationForm/getRegistrationForm"
import { getMyRegistrationFormAnswer } from "src/lib/api/registrationForm/getMyRegistrationFormAnswer"
import { updateRegistrationFormAnswer } from "src/lib/api/registrationForm/updateRegistrationFormAnswer"
import { reportError as reportErrorHandler } from "src/lib/errorTracking"

import { pagesPath } from "src/utils/$path"

import {
  Button,
  FormItemSpacer,
  Head,
  Panel,
  ParagraphWithUrlParsing,
  Spinner,
} from "src/components"
import {
  IntegerFormItem,
  RadioFormItem,
  TextFormItem,
} from "src/components/FormItem"

import styles from "./answer.module.scss"

export type Query = {
  id: string
  update?: boolean
}

type Inputs = {
  items: Array<
    Extract<
      FormAnswerItemInForm,
      { type: "text" | "integer" | "checkbox" | "radio" }
    >
  >
}

const AnswerRegistrationForm: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()
  const { addToast } = useToastDispatcher()
  const router = useRouter()

  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>()
  const [generalError, setGeneralError] = useState<
    | "noProject"
    | "noRegistrationFormId"
    | "registrationFormNotFound"
    | "projectNotFound"
    | "pendingProjectNotFound"
    | "timeout"
    | "unknown"
  >()
  const [processing, setProcessing] = useState(false)

  const { id: registrationFormId, update: updateMode = false } =
    router.query as Partial<Query>

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    mode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: true,
    defaultValues: {
      items: [],
    },
  })

  const { append } = useFieldArray({
    control,
    name: "items",
  })

  const onSubmit = async ({ items }: Inputs) => {
    // useEffect 側でハンドルしてるので適当
    if (authState?.status !== "bothSignedIn") return
    if (!myProjectState?.myProject) return
    if (!registrationFormId) return

    if (updateMode) {
      if (
        window.confirm(
          [
            "企画基本情報を編集すると企画登録の完了日時が現在の日時に更新され、先着順で企画数を制限する教室貸出などで不利になる可能性があります",
            "送信してよろしいですか?",
          ].join("\n")
        )
      ) {
        setProcessing(true)

        const requestProps = {
          ...(myProjectState.isPending === false
            ? {
                projectId: myProjectState.myProject.id,
              }
            : { pendingProjectId: myProjectState.myProject.id }),
          registrationFormId,
          items: items.map((item) => {
            if (item.type === "checkbox") {
              return {
                ...item,
                answer: Object.entries(item.answer).reduce(
                  (acc, [id, value]) => {
                    if (value) acc.push(id)
                    return acc
                  },
                  [] as string[]
                ),
              }
            }
            return item
          }),
        }

        try {
          const res = await updateRegistrationFormAnswer({
            ...requestProps,
            idToken: await authState.firebaseUser.getIdToken(),
          })

          setProcessing(false)

          if (res && "errorCode" in res) {
            switch (res.errorCode) {
              case "outOfProjectCreationPeriod":
                addToast({
                  title: "企画応募期間外です",
                  descriptions: [
                    "企画応募期間外に登録申請の回答を修正することはできません",
                  ],
                  kind: "error",
                })
                break
              case "invalidFormAnswer": {
                const invalidFormAnswerItemId: string | undefined =
                  res.error?.error?.info?.id
                const invalidFormAnswerItem = registrationForm?.items.find(
                  (item) => item.id === invalidFormAnswerItemId
                )

                if (invalidFormAnswerItemId && invalidFormAnswerItem) {
                  addToast({
                    title: `「${invalidFormAnswerItem.name}」への回答が正しくありません`,
                    descriptions: ["項目の説明文などを再度ご確認ください"],
                    kind: "error",
                  })
                  // TODO: 安定してきたらここはreportしなくて良い
                  reportErrorHandler(
                    "failed to update registration form answer: INVALID_FORM_ANSWER_ITEM",
                    { error: res, registrationForm, requestProps }
                  )
                  break
                }

                addToast({ title: "エラーが発生しました", kind: "error" })
                reportErrorHandler(
                  "failed to handle INVALID_FORM_ANSWER_ITEM in updating registration form answer",
                  { error: res, registrationForm, requestProps }
                )
                break
              }
              case "timeout":
                addToast({ title: "通信に失敗しました", kind: "error" })
                break
              case "unknown":
                addToast({ title: "不明なエラーが発生しました", kind: "error" })
                reportErrorHandler(
                  "failed to update registration form answer",
                  {
                    registrationForm,
                    requestProps,
                    error: res,
                  }
                )
                break
            }
          } else {
            addToast({ title: "回答を修正しました", kind: "success" })
            router.push(pagesPath.project.$url())
          }
        } catch (err) {
          setProcessing(false)
          addToast({ title: "不明なエラーが発生しました", kind: "error" })
          reportErrorHandler("failed to update registration form answer", {
            registrationForm,
            requestProps,
            error: err,
          })
        }
      }
    } else {
      if (window.confirm("回答を送信しますか?")) {
        setProcessing(true)

        const requestProps = {
          pendingProjectId: myProjectState.myProject.id,
          registrationFormId: registrationFormId,
          items: items.map((item) => {
            if (item.type === "checkbox") {
              return {
                ...item,
                answer: Object.entries(item.answer).reduce(
                  (acc, [id, value]) => {
                    if (value) acc.push(id)
                    return acc
                  },
                  [] as string[]
                ),
              }
            }
            return item
          }),
        }

        try {
          await answerRegistrationForm({
            ...requestProps,
            idToken: await authState.firebaseUser.getIdToken(),
          })
          setProcessing(false)
          addToast({ title: "送信しました", kind: "success" })
          router.push(pagesPath.project.$url())
        } catch (err) {
          setProcessing(false)
          const reportError = (
            message = "failed to answer registration form"
          ) => {
            reportErrorHandler(message, {
              error: err,
              registrationForm,
              body: requestProps,
            })
          }

          switch (err.error?.info?.type) {
            case "ALREADY_ANSWERED_REGISTRATION_FORM": {
              addToast({
                title: "既に回答している登録申請です",
                kind: "error",
              })
              break
            }
            case "OUT_OF_PROJECT_CREATION_PERIOD": {
              addToast({ title: "企画応募期間外です", kind: "error" })
              break
            }
            case "INVALID_FORM_ANSWER_ITEM": {
              const invalidFormAnswerItemId: string | undefined =
                err.error?.info?.id
              const invalidFormAnswerItem = registrationForm?.items.find(
                (item) => item.id === invalidFormAnswerItemId
              )

              if (invalidFormAnswerItemId && invalidFormAnswerItem) {
                addToast({
                  title: `「${invalidFormAnswerItem.name}」への回答が正しくありません`,
                  descriptions: ["項目の説明文などを再度ご確認ください"],
                  kind: "error",
                })
                // TODO: 安定してきたらここはreportしなくて良い
                reportError(
                  "failed to answer registration form: INVALID_FORM_ANSWER_ITEM"
                )
                break
              }

              addToast({ title: "エラーが発生しました", kind: "error" })
              reportError()
              break
            }
            default: {
              addToast({ title: "エラーが発生しました", kind: "error" })
              reportError()
              break
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    ;(async () => {
      setGeneralError(undefined)
      if (authState?.status !== "bothSignedIn") return
      if (!myProjectState?.myProject) {
        setGeneralError("noProject")
        return
      }
      if (!registrationFormId) {
        setGeneralError("noRegistrationFormId")
        return
      }

      const { registrationForm: fetchedRegistrationForm } =
        await getRegistrationForm({
          ...(myProjectState.isPending
            ? { pendingProjectId: myProjectState.myProject.id }
            : { projectId: myProjectState.myProject.id }),
          registrationFormId: registrationFormId,
          idToken: await authState.firebaseUser.getIdToken(),
        }).catch(async (err) => {
          addToast({ title: "エラーが発生しました", kind: "error" })
          const body = await err.response?.json()
          throw body ?? err
        })

      append(
        fetchedRegistrationForm.items
          .map((formItem) => {
            switch (formItem.type) {
              case "text": {
                return {
                  item_id: formItem.id,
                  type: "text" as const,
                  answer: null,
                }
              }
              case "checkbox": {
                return {
                  item_id: formItem.id,
                  type: "checkbox" as const,
                  answer: Object.fromEntries(
                    formItem.boxes.map(({ id }) => [id, false])
                  ),
                }
              }
              case "radio": {
                return {
                  item_id: formItem.id,
                  type: "radio" as const,
                  answer: null,
                }
              }
              case "integer": {
                return {
                  item_id: formItem.id,
                  type: "integer" as const,
                  answer: null,
                }
              }
            }
          })
          .filter(
            // FIXME:
            (nullable): nullable is any => Boolean(nullable)
          )
      )

      setRegistrationForm(fetchedRegistrationForm)

      if (updateMode) {
        try {
          const res = await getMyRegistrationFormAnswer({
            ...(myProjectState.isPending === true
              ? {
                  pendingProjectId: myProjectState.myProject.id,
                }
              : {
                  projectId: myProjectState.myProject.id,
                }),
            registrationFormId,
            idToken: await authState.firebaseUser.getIdToken(),
          })

          if ("errorCode" in res) {
            switch (res.errorCode) {
              case "timeout":
                addToast({ title: "通信に失敗しました", kind: "error" })
                setGeneralError("timeout")
                break
              default: {
                addToast({ title: "不明なエラーが発生しました", kind: "error" })
                setGeneralError("unknown")
                reportErrorHandler(
                  "failed to get my past registration form answer",
                  {
                    registrationForm: fetchedRegistrationForm,
                    error: res,
                  }
                )
                break
              }
            }
          } else {
            if (
              fetchedRegistrationForm.items.length !== res.answer?.items.length
            ) {
              addToast({ title: "不明なエラーが発生しました", kind: "error" })
              setGeneralError("unknown")
              reportErrorHandler(
                "number of registration form items doesn't match",
                {
                  registrationForm: fetchedRegistrationForm,
                  answer: res.answer,
                  error: res,
                }
              )
              return
            }

            res.answer.items.map((answerItem, index) => {
              switch (answerItem.type) {
                case "text":
                  setValue(
                    `items.${index}.answer` as const,
                    answerItem.answer,
                    { shouldValidate: true }
                  )
                  break
                case "radio":
                  setValue(
                    `items.${index}.answer` as const,
                    answerItem.answer,
                    { shouldValidate: true }
                  )
                  break
                case "integer":
                  setValue(
                    `items.${index}.answer` as const,
                    answerItem.answer,
                    { shouldValidate: true }
                  )
                  break
              }
            })
          }
        } catch (err) {
          addToast({ title: "不明なエラーが発生しました", kind: "error" })
          setGeneralError("unknown")
          reportErrorHandler("failed to get my past registration form answer", {
            registrationForm: fetchedRegistrationForm,
            error: err,
          })
        }
      }
    })()
  }, [authState, myProjectState, registrationFormId])

  return (
    <div className={styles.wrapper}>
      <Head title={updateMode ? "登録申請の回答を修正" : "登録申請に回答"} />
      <h1 className={styles.title}>
        {updateMode ? "登録申請の回答を修正" : "登録申請に回答"}
      </h1>
      {registrationForm && generalError === undefined ? (
        <>
          <div className={styles.section}>
            <Panel>
              <h2 className={styles.formName}>{registrationForm.name}</h2>
              {registrationForm.description && (
                <ParagraphWithUrlParsing
                  text={registrationForm.description}
                  normalTextClassName={styles.formDescription}
                />
              )}
            </Panel>
          </div>
          <div className={styles.section}>
            <Panel>
              <form
                className={styles.form}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {registrationForm.items.map((formItem, index) => {
                  return (
                    <FormItemSpacer key={formItem.id}>
                      <>
                        {formItem.type === "text" && (
                          <TextFormItem
                            formItem={formItem}
                            register={register(
                              `items.${index}.answer` as const,
                              {
                                required: formItem.is_required,
                                maxLength: formItem.max_length,
                                minLength: formItem.min_length,
                                setValueAs: (value: string) =>
                                  value?.length ? value.trim() : null,
                              }
                            )}
                            errors={[
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.required && "必須項目です",
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.maxLength &&
                                `${formItem.max_length}字以内で入力してください`,
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.minLength &&
                                `${formItem.min_length}字以上で入力してください`,
                            ]}
                          />
                        )}
                        {formItem.type === "radio" && (
                          <RadioFormItem
                            formItem={formItem}
                            register={register(
                              `items.${index}.answer` as const,
                              {
                                required: formItem.is_required,
                              }
                            )}
                            errors={[
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.required && "必須項目です",
                            ]}
                          />
                        )}
                        {formItem.type === "integer" && (
                          <IntegerFormItem
                            formItem={formItem}
                            register={register(
                              `items.${index}.answer` as const,
                              {
                                required: formItem.is_required,
                                setValueAs: (value) =>
                                  value === "" ? null : Number(value),
                              }
                            )}
                            errors={[
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.required && "必須項目です",
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.min &&
                                `${formItem.min}以上で入力してください`,
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.max &&
                                `${formItem.max}以下で入力してください`,
                            ]}
                          />
                        )}
                      </>
                    </FormItemSpacer>
                  )
                })}
                <div className={styles.submitButton}>
                  <Button
                    fullWidth
                    icon="paper-plane"
                    type="submit"
                    processing={processing}
                  >
                    {updateMode ? "修正した回答を送信する" : "回答を送信する"}
                  </Button>
                </div>
              </form>
            </Panel>
          </div>
        </>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            <>
              {(() => {
                if (generalError === "noProject")
                  return <p>メンバーとなっている企画がありません</p>

                if (generalError === "noRegistrationFormId")
                  return <p>お探しの登録申請は見つかりませんでした</p>

                if (generalError === "timeout") return <p>通信に失敗しました</p>

                if (generalError === "unknown")
                  return <p>不明なエラーが発生しました</p>

                return <Spinner />
              })()}
            </>
          </div>
        </Panel>
      )}
    </div>
  )
}
AnswerRegistrationForm.layout = "default"
AnswerRegistrationForm.rbpac = { type: "higherThanIncluding", role: "general" }

export default AnswerRegistrationForm
