import { PageFC } from "next"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

import { useForm, useFieldArray } from "react-hook-form"

import { createFile } from "../../../lib/api/file/createFile"
import { answerForm } from "../../../lib/api/form/answerForm"
import { getProjectForm } from "../../../lib/api/form/getProjectForm"
import { Form } from "../../../types/models/form"
import {
  FormAnswerItemInForm,
  FormAnswerItemInFormWithRealFiles,
} from "../../../types/models/form/answerItem"
import { pagesPath } from "../../../utils/$path"
import styles from "./answer.module.scss"
import {
  Button,
  Checkbox,
  Dropdown,
  FormItemSpacer,
  Head,
  Panel,
  ParagraphWithUrlParsing,
  Spinner,
  Textarea,
  TextField,
} from "src/components"
import { FileFormItem } from "src/components/FormItem"
import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { reportError as reportErrorHandler } from "src/lib/errorTracking/reportError"

export type Query = {
  formId: string
}

type Inputs = {
  items: Array<FormAnswerItemInFormWithRealFiles>
}

const AnswerForm: PageFC = () => {
  const [form, setForm] = useState<Form>()
  const [generalError, setGeneralError] = useState<
    "formIdNotFound" | "formNotFound" | "projectPending" | "unknown"
  >()
  const [formItemErrors, setFormItemErrors] = useState<
    Array<"minChecks" | "maxChecks" | null>
  >([])
  const [processing, setProcessing] = useState(false)

  const router = useRouter()

  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()
  const { addToast } = useToastDispatcher()

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
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
    if (authState?.status !== "bothSignedIn") return

    if (!form) return

    if (myProjectState?.isPending !== false) return

    const curFormItemErrors = formItemErrors

    items.map((item, index) => {
      if (item.type === "checkbox") {
        const formItem = form?.items[index]
        if (formItem?.type !== "checkbox") {
          addToast({ title: "エラーが発生しました", kind: "error" })
          return
        }

        const checkedCount = Object.entries(item.answer).reduce(
          (acc, [_, value]) => {
            if (value) return ++acc
            return acc
          },
          0
        )

        if (
          formItem.min_checks != undefined &&
          checkedCount < formItem.min_checks
        ) {
          curFormItemErrors[index] = "minChecks"
        } else if (
          formItem.max_checks != undefined &&
          checkedCount > formItem.max_checks
        ) {
          curFormItemErrors[index] = "maxChecks"
        } else {
          curFormItemErrors[index] = null
        }
      }
    })

    setFormItemErrors(curFormItemErrors)

    if (!curFormItemErrors.find((error) => Boolean(error))) {
      if (window.confirm("回答を送信しますか?")) {
        setProcessing(true)

        /**
         * ファイルとして `File` ではなくバックから返ってきた `fileId` が入った items
         */
        const itemsWithUploadedFiles: Array<FormAnswerItemInForm> = items.map(
          (item) => {
            if (item.type === "file") {
              return {
                item_id: item.item_id,
                type: "file",
                answer: [],
              }
            }
            return item
          }
        )

        const requestProps = {
          projectId: myProjectState.myProject.id,
          formId: form.id,
          items: itemsWithUploadedFiles,
        }

        try {
          const fileUploadFormData = new FormData()
          items.map((item) => {
            if (item.type === "file" && item.answer?.length) {
              item.answer.map((f) =>
                fileUploadFormData.append(
                  // name ディレクティブに FormItemId を入れて区別する
                  item.item_id,
                  f,
                  encodeURIComponent(f.name)
                )
              )
            }
          })
          if (
            // ファイルが1つ以上存在する
            !fileUploadFormData.values().next().done
          ) {
            try {
              const fileUploadRes = await createFile({
                props: {
                  body: fileUploadFormData,
                },
                idToken: await authState.firebaseUser.getIdToken(),
              })

              if (fileUploadRes.error) {
                setProcessing(false)
                switch (fileUploadRes.error) {
                  case "outOfFileUsageQuota": {
                    addToast({
                      title: "ファイルアップロードの容量上限に達しています",
                      kind: "error",
                    })
                    break
                  }
                }
                return
              }

              itemsWithUploadedFiles.map((item) => {
                if (item.type === "file") {
                  item.answer = fileUploadRes.files
                    // name ディレクティブで当該 formItem に紐付けられたファイルだけ区別する
                    .filter((f) => f.name === item.item_id)
                    .map((f) => ({ file_id: f.file.id }))
                }
              })
            } catch (err) {
              setProcessing(false)
              addToast({
                title: "ファイルのアップロードに失敗しました",
                kind: "error",
              })
              reportErrorHandler(
                "failed to upload file before answering form",
                {
                  error: err,
                }
              )
              return
            }
          }

          await answerForm({
            props: requestProps,
            idToken: await authState.firebaseUser.getIdToken(),
          })

          setProcessing(false)
          addToast({ title: "回答を送信しました", kind: "success" })
          router.push(pagesPath.project.form.$url())
        } catch (err) {
          setProcessing(false)

          const body = await err.response?.json()
          if (body) {
            const reportError = (message = "failed to answer form") => {
              reportErrorHandler(message, {
                error: err,
                form: form,
                body: requestProps,
              })
            }

            switch (body.error?.info?.type) {
              case "ALREADY_ANSWERED_FORM":
                addToast({ title: "既に回答している申請です", kind: "error" })
                break
              case "OUT_OF_ANSWER_PERIOD":
                addToast({ title: "回答受け付け期間外です", kind: "error" })
                break
              case "INVALID_FORM_ANSWER": {
                const invalidFormAnswerItemId: string | undefined =
                  err.error?.info?.id
                const invalidFormAnswerItem = form?.items.find(
                  (item) => item.id === invalidFormAnswerItemId
                )

                if (invalidFormAnswerItemId && invalidFormAnswerItem) {
                  addToast({
                    title: `「${invalidFormAnswerItem.name}」への回答が正しくありません`,
                    descriptions: ["項目の説明文などを再度ご確認ください"],
                    kind: "error",
                  })
                  // TODO: 安定してきたらここはreportしなくて良い
                  reportError("failed to answer form: INVALID_FORM_ANSWER")
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
          } else {
            reportErrorHandler("failed to answer form with unknown error", {
              error: err,
            })
          }
        }
      }
    }
  }

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

      getProjectForm({
        props: {
          projectId: myProjectState.myProject.id,
          formId,
        },
        idToken: await authState.firebaseUser.getIdToken(),
      })
        .catch(async (err) => {
          const body = await err.response?.json()
          if (body) {
            setGeneralError("formNotFound")
            throw body
          }

          setGeneralError("unknown")
          throw err
        })
        .then(({ form: fetchedForm }) => {
          append(
            fetchedForm.items
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
                  case "file": {
                    return {
                      item_id: formItem.id,
                      type: "file" as const,
                      // dirty: react-hook-form に defaultValue として空配列渡すと消える挙動の workaround
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

          setForm(fetchedForm)
        })
    })()
  }, [authState, myProjectState, router.query])

  return (
    <div className={styles.wrapper}>
      <Head title={form?.name ?? "申請に回答"} />
      <h1 className={styles.title}>申請に回答</h1>
      {form && !generalError ? (
        <>
          <div className={styles.formGeneralInfoWrapper}>
            <Panel>
              <h2 className={styles.formName}>{form.name}</h2>
              {form.description && (
                <ParagraphWithUrlParsing
                  text={form.description}
                  normalTextClassName={styles.formDescription}
                />
              )}
            </Panel>
          </div>
          <Panel>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className={styles.formItems}>
                {form.items.map((formItem, index) => (
                  <FormItemSpacer key={formItem.id}>
                    {(() => {
                      if (formItem.type === "text") {
                        if (formItem.accept_multiple_lines)
                          return (
                            <Textarea
                              label={formItem.name}
                              required={formItem.is_required}
                              placeholder={formItem.placeholder}
                              description={formItem.description.split("\n")}
                              descriptionUrlParsing
                              error={[
                                (errors?.items?.[index]?.answer as any)?.types
                                  ?.required && "必須項目です",
                                (errors?.items?.[index]?.answer as any)?.types
                                  ?.maxLength &&
                                  `${formItem.max_length}字以内で入力してください`,
                                (errors?.items?.[index]?.answer as any)?.types
                                  ?.minLength &&
                                  `${formItem.min_length}字以上で入力してください`,
                              ]}
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
                            />
                          )

                        return (
                          <TextField
                            type="text"
                            label={formItem.name}
                            required={formItem.is_required}
                            placeholder={formItem.placeholder}
                            description={formItem.description.split("\n")}
                            descriptionUrlParsing
                            error={[
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.required && "必須項目です",
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.maxLength &&
                                `${formItem.max_length}字以内で入力してください`,
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.minLength &&
                                `${formItem.min_length}字以上で入力してください`,
                            ]}
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
                          />
                        )
                      }

                      if (formItem.type === "checkbox") {
                        return (
                          <>
                            <p className={styles.checkboxesTitle}>
                              {formItem.name}
                            </p>
                            {formItem.boxes.map(({ id, label }) => (
                              <div className={styles.checkboxWrapper} key={id}>
                                <Checkbox
                                  label={label}
                                  checked={
                                    watch(
                                      `items.${index}.answer.${id}` as const
                                    ) ?? false
                                  }
                                  register={register(
                                    `items.${index}.answer.${id}` as const
                                  )}
                                />
                              </div>
                            ))}
                            {Boolean(formItem.description.length) && (
                              <div className={styles.checkboxDescriptions}>
                                <ParagraphWithUrlParsing
                                  text={formItem.description}
                                  normalTextClassName={
                                    styles.checkboxDescription
                                  }
                                />
                              </div>
                            )}
                            <p className={styles.checkboxesError}>
                              {(() => {
                                if (formItemErrors[index] === "maxChecks")
                                  return `最大${formItem.max_checks}つしか選択できません`
                                if (formItemErrors[index] === "minChecks")
                                  return `最低${formItem.min_checks}つ選択してください`
                              })()}
                            </p>
                          </>
                        )
                      }

                      if (formItem.type === "radio") {
                        return (
                          <Dropdown
                            label={formItem.name}
                            description={formItem.description.split("\n")}
                            descriptionUrlParsing
                            options={[
                              {
                                value: "",
                                label: "選択してください",
                              },
                              ...formItem.buttons.map(({ id, label }) => ({
                                value: id,
                                label,
                              })),
                            ]}
                            error={[
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.required && "必須項目です",
                            ]}
                            required={formItem.is_required}
                            register={register(
                              `items.${index}.answer` as const,
                              { required: formItem.is_required }
                            )}
                          />
                        )
                      }

                      if (formItem.type === "file") {
                        return (
                          <FileFormItem
                            formItem={formItem}
                            control={control}
                            name={`items.${index}.answer` as const}
                            errors={[
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.required && "必須項目です",
                            ]}
                            files={
                              (watch(`items.${index}.answer` as const) ??
                                []) as File[]
                            }
                          />
                        )
                      }
                    })()}
                  </FormItemSpacer>
                ))}
              </div>
              <Button
                type="submit"
                icon="paper-plane"
                processing={processing}
                fullWidth={true}
              >
                回答する
              </Button>
            </form>
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
AnswerForm.layout = "default"
AnswerForm.rbpac = { type: "higherThanIncluding", role: "general" }

export default AnswerForm
