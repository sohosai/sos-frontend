import { useState, useEffect } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useForm, useFieldArray } from "react-hook-form"

import { useAuthNeue } from "../../../contexts/auth"
import { useMyProject } from "../../../contexts/myProject"

import { Form } from "../../../types/models/form"
import { FormAnswerItemInForm } from "../../../types/models/form/answerItem"

import { getProjectForm } from "../../../lib/api/form/getProjectForm"

import { pagesPath } from "../../../utils/$path"

import {
  Button,
  Checkbox,
  FormItemSpacer,
  Panel,
  Spinner,
  Textarea,
  TextField,
} from "../../../components"

import styles from "./answer.module.scss"
import { answerForm } from "../../../lib/api/form/answerForm"

export type Query = {
  formId: string
}

type Inputs = {
  items: FormAnswerItemInForm[]
}

const AnswerForm: PageFC = () => {
  const [form, setForm] = useState<Form>()
  const [generalError, setGeneralError] = useState<
    "formIdNotFound" | "formNotFound" | "projectPending" | "unknown"
  >()
  const [formError, setFormError] = useState<"unknown">()
  const [formItemErrors, setFormItemErrors] = useState<
    Array<"minChecks" | "maxChecks" | null>
  >([])
  const [processing, setProcessing] = useState(false)

  const router = useRouter()

  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()

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
          setFormError("unknown")
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

        answerForm({
          props: {
            projectId: myProjectState.myProject.id,
            formId: form.id,
            items,
          },
          idToken: await authState.firebaseUser.getIdToken(),
        })
          .catch(async (err) => {
            setProcessing(false)
            setFormError("unknown")
            const body = await err.response?.json()
            throw body ?? err
          })
          .then(() => {
            setProcessing(false)

            // TODO: toast
            window.alert("回答を送信しました")

            router.push(pagesPath.project.form.$url())
          })
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
                      answer: "",
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
      <h1 className={styles.title}>申請に回答</h1>
      {form && !generalError ? (
        <>
          <div className={styles.formGeneralInfoWrapper}>
            <Panel>
              <h2 className={styles.formName}>{form.name}</h2>
              {form.description &&
                form.description.split("\n").map((text, index) => (
                  <p className={styles.formDescription} key={index}>
                    {text}
                  </p>
                ))}
            </Panel>
          </div>
          <Panel>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                {formItem.description
                                  .split("\n")
                                  .map((text, index) => (
                                    <p
                                      className={styles.checkboxDescription}
                                      key={index}
                                    >
                                      {text}
                                    </p>
                                  ))}
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
              {formError === "unknown" && (
                <p className={styles.formError}>不明なエラーが発生しました</p>
              )}
            </form>
          </Panel>
        </>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            {(() => {
              if (generalError === "projectPending")
                return <p>登録申請への回答と副責任者登録を完了してください</p>

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
