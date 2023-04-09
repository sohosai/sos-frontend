import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { PageFC } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { useForm, useFieldArray } from "react-hook-form"

import { v4 as uuid } from "uuid"

import {
  Button,
  Checkbox,
  DateTimeSelector,
  FormItemSpacer,
  Head,
  IconButton,
  Panel,
  ProjectQuerySelector,
  Spinner,
  Textarea,
  TextField,
  Tooltip,
} from "../../../components/"
import { reportError } from "../../../lib/errorTracking/reportError"

import type { FormItem } from "../../../types/models/form/item"
import { pagesPath } from "../../../utils/$path"
import styles from "./edit.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"
import { getForm } from "src/lib/api/form/getForm"
import { updateForm } from "src/lib/api/form/updateForm"
import { ProjectAttribute, ProjectCategory } from "src/types/models/project"

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export type Query = {
  id: string
}

type Inputs = {
  title: string
  description: string
  starts_at: {
    month: number
    day: number
    hour: number
    minute: number
  }
  ends_at: {
    month: number
    day: number
    hour: number
    minute: number
  }
  categories: {
    [key in ProjectCategory]: boolean
  }
  attributes: {
    [key in ProjectAttribute]: boolean
  }
  attributesAndOr: "or" | "and"
  items: FormItem[]
}

const EditForm: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const router = useRouter()

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<
    "notFound" | "alreadyStarted" | "unknown"
  >()

  const { id: formId } = router.query as Partial<Query>

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<Inputs>({
    mode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: true,
  })

  const { fields, append, remove, swap, update } = useFieldArray({
    control,
    name: "items",
  })

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      setError(undefined)
      if (!formId || typeof formId !== "string") {
        setError("notFound")
        return
      }

      try {
        const { form: fetchedForm } = await getForm({
          props: { formId },
          idToken: await authState.firebaseUser.getIdToken(),
        })

        const startDate = dayjs(fetchedForm.starts_at)
        const endDate = dayjs(fetchedForm.ends_at)

        if (startDate.diff(dayjs()) <= 0) {
          setError("alreadyStarted")
          return
        }

        const starts_at = {
          month: startDate.month() + 1,
          day: startDate.date(),
          hour: startDate.hour(),
          minute: startDate.minute(),
        }
        const ends_at = {
          month: endDate.month() + 1,
          day: endDate.date(),
          hour: endDate.hour(),
          minute: endDate.minute(),
        }
        setValue("title", fetchedForm.name)
        setValue("description", fetchedForm.description)
        setValue("starts_at", starts_at)
        setValue("ends_at", ends_at)

        fetchedForm.condition.query.map((cond) => {
          if (cond.attributes.length == 1) {
            setValue("attributesAndOr", "or")
          } else {
            setValue("attributesAndOr", "and")
          }
          if (cond.category !== null) {
            setValue(`categories.${cond.category}`, true)
          }
          cond.attributes.map((attribute) =>
            setValue(`attributes.${attribute}`, true)
          )
        })

        fetchedForm.items.map((field, id) => {
          update(id, field)
          if (field.type === "checkbox" && typeof field.boxes !== "string") {
            setValue(
              `items.${id}.boxes`,
              field.boxes
                .map((v: { id: string; label: string }) => {
                  return v.label.trim()
                })
                .join("\n")
            )
          }
          if (field.type === "radio" && typeof field.buttons !== "string") {
            setValue(
              `items.${id}.buttons`,
              field.buttons
                .map((v: { id: string; label: string }) => {
                  return v.label.trim()
                })
                .join("\n")
            )
          }
        })
      } catch (err) {
        // FIXME: any
        if ((err as any)?.error?.info?.type === "FORM_NOT_FOUND") {
          setError("notFound")
          addToast({ title: "申請が見つかりませんでした", kind: "error" })
          return
        }

        setError("unknown")
        addToast({ title: "エラーが発生しました", kind: "error" })
        throw err
      }
    })()
  }, [authState, formId])

  const onSubmit = async ({
    title,
    description,
    starts_at,
    ends_at,
    categories,
    attributes,
    attributesAndOr,
    items,
  }: Inputs) => {
    if (authState === null || authState.firebaseUser == null) {
      addToast({ title: "不明なエラーが発生しました", kind: "error" })
      return
    }

    if (!formId) {
      addToast({ title: "申請が見つかりませんでした", kind: "error" })
      return
    }

    const idToken = await authState.firebaseUser.getIdToken()

    const categoriesArray = Object.entries(categories)
      .map(([category, value]) => {
        if (!value) return
        return category as ProjectCategory
      })
      .filter((nullable): nullable is ProjectCategory => Boolean(nullable))

    const nonEmptyCategoriesArray = categoriesArray.length
      ? categoriesArray
      : ([null] as const)

    const attributesArray = Object.entries(attributes)
      .map(([attribute, value]) => {
        if (!value) return
        return attribute as ProjectAttribute
      })
      .filter((nullable): nullable is ProjectAttribute => Boolean(nullable))

    const query =
      attributesAndOr === "or"
        ? nonEmptyCategoriesArray
            .map((category: ProjectCategory | null) => {
              if (!attributesArray.length)
                return {
                  category,
                  attributes: [],
                }

              return attributesArray.map((attribute) => ({
                category,
                attributes: [attribute],
              }))
            })
            .flat()
        : nonEmptyCategoriesArray.map((category: ProjectCategory | null) => ({
            category,
            attributes: attributesArray,
          }))

    if (process.browser && window.confirm("申請を更新しますか?")) {
      setProcessing(true)

      try {
        const res = await updateForm({
          props: {
            id: formId,
            name: title,
            description: description ?? "",
            starts_at: dayjs
              .tz(
                `${starts_at.month}-${starts_at.day}-${starts_at.hour}-${starts_at.minute}`,
                "M-D-H-m",
                "Asia/Tokyo"
              )
              .valueOf(),
            ends_at: dayjs
              .tz(
                `${ends_at.month}-${ends_at.day}-${ends_at.hour}-${ends_at.minute}`,
                "M-D-H-m",
                "Asia/Tokyo"
              )
              .valueOf(),
            condition: {
              query,
              // TODO:
              includes: [],
              excludes: [],
            },
            items,
          },
          idToken,
        })

        if ("errorCode" in res) {
          setProcessing(false)

          switch (res.errorCode) {
            case "invalidField":
              // TODO: どういうケースかよくわかってない
              addToast({ title: "エラーが発生しました", kind: "error" })
              reportError("failed to create new form", { error: res.error })
              break
            case "invalidFormPeriod":
              addToast({
                title: "入力された回答受付期間は正しくありません",
                kind: "error",
              })
              break
            case "formNotFound":
              addToast({
                title: "申請が見つかりませんでした",
                kind: "error",
              })
              break
            case "tooEarlyFormPeriodStart":
              addToast({
                title:
                  "現在より以前に回答開始される申請を作成することはできません",
                kind: "error",
              })
              break
            case "alreadyStartedForm":
              addToast({
                title: "既に回答が開始されている申請です",
                kind: "error",
              })
              break
            case "timeout":
              addToast({
                title: "申請の更新を完了できませんでした",
                descriptions: ["通信環境などをご確認ください"],
                kind: "error",
              })
              break
            default:
              addToast({
                title: "不明なエラーが発生しました",
                kind: "error",
              })
          }
          return
        }

        setProcessing(false)
        addToast({ title: "申請を更新しました", kind: "success" })

        router.push(pagesPath.committee.form.$url())
      } catch (err) {
        setProcessing(false)
        addToast({ title: "不明なエラーが発生しました", kind: "error" })
        reportError("failed to create new form with unknown exception", {
          error: err,
        })
      }
    }
  }

  const addItem = (type: FormItem["type"]) => {
    switch (type) {
      case "text": {
        append({
          id: uuid(),
          type: "text",
          name: "",
          description: "",
          conditions: null,
          accept_multiple_lines: false,
          is_required: false,
          placeholder: "",
        })
        break
      }
      case "checkbox": {
        append({
          id: uuid(),
          type: "checkbox",
          name: "",
          description: "",
          conditions: null,
          boxes: "",
        })
        break
      }
      case "radio": {
        append({
          id: uuid(),
          name: "",
          description: "",
          conditions: null,
          type: "radio",
          is_required: false,
          buttons: "",
        })
        break
      }
      case "file": {
        append({
          id: uuid(),
          name: "",
          description: "",
          conditions: null,
          type: "file",
          accepted_types: null,
          is_required: false,
          accept_multiple_files: false,
        })
        break
      }
    }
  }

  const removeItem = (index: number) => {
    if (process.browser && window.confirm("この質問を削除しますか?")) {
      remove(index)
    }
  }

  const swapItem = (indexA: number, indexB: number) => {
    if (fields[indexA] && fields[indexB]) swap(indexA, indexB)
  }

  return (
    <div className={styles.wrapper}>
      <Head title="申請を編集" />
      <h1 className={styles.title}>申請を編集</h1>
      {formId && error === undefined ? (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.sectionWrapper}>
            <Panel>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="申請のタイトル"
                  placeholder="〇〇申請"
                  required
                  error={[errors.title?.types?.required && "必須項目です"]}
                  register={register("title", {
                    required: true,
                    setValueAs: (value) => value?.trim(),
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <Textarea
                  label="申請の説明"
                  description={[
                    "URLはリンクとして認識されます(URLのある行にはURL以外を記述しないでください)",
                  ]}
                  error={[
                    errors.description?.types?.maxLength &&
                      "1024字以内で入力してください",
                  ]}
                  register={register("description", {
                    maxLength: 1024,
                    setValueAs: (value) => value?.trim(),
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <DateTimeSelector
                  label="受付開始日時"
                  register={register}
                  registerOptions={{
                    month: {
                      name: "starts_at.month",
                      required: true,
                    },
                    day: {
                      name: "starts_at.day",
                      required: true,
                    },
                    hour: {
                      name: "starts_at.hour",
                      required: true,
                    },
                    minute: {
                      name: "starts_at.minute",
                      required: true,
                    },
                  }}
                  errorTypes={{
                    month: errors.starts_at?.month?.types,
                    day: errors.starts_at?.day?.types,
                    hour: errors.starts_at?.hour?.types,
                    minute: errors.starts_at?.minute?.types,
                  }}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <DateTimeSelector
                  label="受付終了日時"
                  register={register}
                  registerOptions={{
                    month: {
                      name: "ends_at.month",
                      required: true,
                    },
                    day: {
                      name: "ends_at.day",
                      required: true,
                    },
                    hour: {
                      name: "ends_at.hour",
                      required: true,
                    },
                    minute: {
                      name: "ends_at.minute",
                      required: true,
                    },
                  }}
                  errorTypes={{
                    month: errors.ends_at?.month?.types,
                    day: errors.ends_at?.day?.types,
                    hour: errors.ends_at?.hour?.types,
                    minute: errors.ends_at?.minute?.types,
                  }}
                />
              </FormItemSpacer>
            </Panel>
          </div>
          <div className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>送信先の絞り込み</h2>
            <Panel>
              <ProjectQuerySelector
                checked={{
                  general_physical: watch("categories.general_physical"),
                  general_online: watch("categories.general_online"),
                  stage_physical: watch("categories.stage_physical"),
                  stage_online: watch("categories.stage_online"),
                  food_physical: watch("categories.food_physical"),
                  cooking_physical: watch("categories.cooking_physical"),
                  academic: watch("attributes.academic"),
                  artistic: watch("attributes.artistic"),
                  outdoor: watch("attributes.outdoor"),
                  committee: watch("attributes.committee"),
                }}
                registers={{
                  general_physical: register("categories.general_physical"),
                  general_online: register("categories.general_online"),
                  stage_physical: register("categories.stage_physical"),
                  stage_online: register("categories.stage_online"),
                  food_physical: register("categories.food_physical"),
                  cooking_physical: register("categories.cooking_physical"),
                  academic: register("attributes.academic"),
                  artistic: register("attributes.artistic"),
                  outdoor: register("attributes.outdoor"),
                  committee: register("attributes.committee"),
                  attributesAndOr: register("attributesAndOr"),
                }}
              />
            </Panel>
          </div>
          <div className={styles.sectionWrapper}>
            <h2 className={styles.sectionTitle}>質問項目</h2>
            {fields.map(({ id }, index) => {
              const type = watch(
                `items.${index}.type` as const
              ) as FormItem["type"]
              const itemNamePlaceholders: {
                [itemType in FormItem["type"]]?: string
              } = {
                checkbox: "必要な文房具",
                radio: "希望する実施日",
              }
              const itemTypeToUiText = (type: FormItem["type"]) => {
                const dict: { [type in FormItem["type"]]: string } = {
                  text: "テキスト",
                  checkbox: "チェックボックス",
                  integer: "数値",
                  radio: "ドロップダウン",
                  grid_radio: "複数ドロップダウン",
                  file: "ファイル",
                }
                return dict[type]
              }
              const itemTypeDescription = (type: FormItem["type"]) => {
                const map: { [type in FormItem["type"]]: string[] } = {
                  text: ["テキスト自由入力の項目です"],
                  checkbox: [
                    "2つ以上の値を選択させる項目です",
                    "単一選択にはドロップダウンをご利用ください",
                  ],
                  integer: ["整数を入力させる項目です"],
                  radio: ["複数の選択肢から1つを選択させる項目です"],
                  grid_radio: [
                    "複数のドロップダウンから重複なしに値を選択させることができます",
                  ],
                  file: ["回答者にファイルをアップロードさせる項目です"],
                }
                return map[type]
              }

              return (
                <div className={styles.itemWrapper} key={id}>
                  <div className={styles.itemPanel}>
                    <Panel>
                      <p className={styles.itemType}>
                        {itemTypeToUiText(type)}
                      </p>
                      <div className={styles.itemTypeDescription}>
                        {itemTypeDescription(type).map((txt) => (
                          <p key={txt}>{txt}</p>
                        ))}
                      </div>
                      <FormItemSpacer>
                        <TextField
                          type="text"
                          label="質問の名前"
                          defaultValue=""
                          placeholder={
                            itemNamePlaceholders[type as FormItem["type"]]
                          }
                          required
                          error={[
                            errors?.items?.[index]?.name?.types?.required &&
                              "必須項目です",
                            errors?.items?.[index]?.name?.types?.maxLength &&
                              "64字以内で入力してください",
                          ]}
                          register={register(`items.${index}.name` as const, {
                            required: true,
                            maxLength: 64,
                            setValueAs: (value) => value?.trim(),
                          })}
                        />
                      </FormItemSpacer>
                      <FormItemSpacer>
                        <Textarea
                          label="説明"
                          rows={2}
                          defaultValue=""
                          description={[
                            "URLはリンクとして認識されます(URLのある行にはURL以外を記述しないでください)",
                          ]}
                          error={[
                            errors?.items?.[index]?.description?.types
                              ?.maxLength && "1024字以内で入力してください",
                          ]}
                          register={register(
                            `items.${index}.description` as const,
                            {
                              maxLength: 1024,
                              setValueAs: (value) => value?.trim(),
                            }
                          )}
                        />
                      </FormItemSpacer>
                      {type === "text" && (
                        <>
                          <FormItemSpacer>
                            <Checkbox
                              label="必須項目にする"
                              checked={watch(
                                `items.${index}.is_required` as any
                              )}
                              register={register(
                                `items.${index}.is_required` as const
                              )}
                            />
                          </FormItemSpacer>
                          <FormItemSpacer>
                            <Checkbox
                              label="複数行テキストにする"
                              checked={watch(
                                `items.${index}.accept_multiple_lines` as const
                              )}
                              register={register(
                                `items.${index}.accept_multiple_lines` as const
                              )}
                            />
                          </FormItemSpacer>
                          <FormItemSpacer>
                            <div className={styles.twoColumnFields}>
                              <div className={styles.twoColumnField}>
                                <TextField
                                  type="number"
                                  label="最小字数"
                                  min="0"
                                  max="1024"
                                  register={register(
                                    `items.${index}.min_length` as const,
                                    {
                                      setValueAs: (value) =>
                                        value === "" || value === null
                                          ? null
                                          : Number(value),
                                    }
                                  )}
                                />
                              </div>
                              <div className={styles.twoColumnField}>
                                <TextField
                                  type="number"
                                  label="最大字数"
                                  min="1"
                                  max="1024"
                                  register={register(
                                    `items.${index}.max_length` as const,
                                    {
                                      setValueAs: (value) =>
                                        value === "" || value === null
                                          ? null
                                          : Number(value),
                                    }
                                  )}
                                />
                              </div>
                            </div>
                          </FormItemSpacer>
                          <FormItemSpacer>
                            <TextField
                              type="text"
                              label="サンプルテキスト"
                              defaultValue=""
                              placeholder="サンプルテキストはこのように表示されます"
                              description="入力欄内にサンプルとして表示されるテキストです"
                              register={register(
                                `items.${index}.placeholder` as const,
                                {
                                  setValueAs: (value) => value?.trim(),
                                }
                              )}
                            />
                          </FormItemSpacer>
                        </>
                      )}
                      {type === "checkbox" && (
                        <>
                          <FormItemSpacer>
                            <div className={styles.twoColumnFields}>
                              <div className={styles.twoColumnField}>
                                <TextField
                                  type="number"
                                  label="最小選択数"
                                  min="0"
                                  max="100"
                                  defaultValue=""
                                  register={register(
                                    `items.${index}.min_checks` as const,
                                    {
                                      setValueAs: (value) => {
                                        return value === "" || value === null
                                          ? null
                                          : Number(value)
                                      },
                                    }
                                  )}
                                />
                              </div>
                              <div className={styles.twoColumnField}>
                                <TextField
                                  type="number"
                                  label="最大選択数"
                                  min="0"
                                  max="100"
                                  defaultValue=""
                                  register={register(
                                    `items.${index}.max_checks` as const,
                                    {
                                      setValueAs: (value) =>
                                        value === "" || value === null
                                          ? null
                                          : Number(value),
                                    }
                                  )}
                                />
                              </div>
                            </div>
                          </FormItemSpacer>
                          <FormItemSpacer>
                            <Textarea
                              label="選択肢"
                              description="選択肢のテキストを改行区切りで入力してください"
                              placeholder={
                                "マジックペン\nガムテープ\n養生テープ"
                              }
                              defaultValue=""
                              error={[
                                (errors?.items?.[index] as any)?.boxes?.types
                                  ?.required && "必須項目です",
                                (errors?.items?.[index] as any)?.boxes?.types
                                  ?.minLength && "必須項目です",
                              ]}
                              required
                              register={register(
                                `items.${index}.boxes` as const,
                                {
                                  required: true,
                                  minLength: 1,
                                  setValueAs: (value) => {
                                    if (typeof value === "string") {
                                      return value
                                        ?.trim()
                                        .split("\n")
                                        .map((label: string) => {
                                          if (!label.trim()) return
                                          return {
                                            id: uuid(),
                                            label: label.trim(),
                                          }
                                        })
                                        .filter(
                                          (
                                            nullable:
                                              | { id: string; label: string }
                                              | undefined
                                          ) => Boolean(nullable)
                                        )
                                    } else {
                                      return value
                                        .map(
                                          (v: { id: string; label: string }) =>
                                            v.label
                                        )
                                        .map((label: string) => {
                                          return label.trim()
                                        })
                                        .join("\n")
                                    }
                                  },
                                }
                              )}
                            />
                          </FormItemSpacer>
                        </>
                      )}
                      {type === "radio" && (
                        <>
                          <FormItemSpacer>
                            <Textarea
                              label="選択肢"
                              description="選択肢のテキストを改行区切りで入力してください"
                              placeholder={"1日目\n2日目"}
                              error={[
                                (errors?.items?.[index] as any)?.buttons?.types
                                  ?.required && "必須項目です",
                              ]}
                              required
                              register={register(
                                `items.${index}.buttons` as const,
                                {
                                  required: true,
                                  setValueAs: (value) => {
                                    if (typeof value === "string") {
                                      return value
                                        ?.trim()
                                        .split("\n")
                                        .map((label: string) => {
                                          if (!label.trim()) return
                                          return {
                                            id: uuid(),
                                            label: label.trim(),
                                          }
                                        })
                                        .filter(
                                          (
                                            nullable:
                                              | { id: string; label: string }
                                              | undefined
                                          ) => Boolean(nullable)
                                        )
                                    } else {
                                      return value
                                        .map(
                                          (v: { id: string; label: string }) =>
                                            v.label
                                        )
                                        .map((label: string) => {
                                          return label.trim()
                                        })
                                        .join("\n")
                                    }
                                  },
                                }
                              )}
                            />
                          </FormItemSpacer>
                          <FormItemSpacer>
                            <Checkbox
                              label="必須項目にする"
                              checked={watch(
                                `items.${index}.is_required` as const
                              )}
                              register={register(
                                `items.${index}.is_required` as const
                              )}
                            />
                          </FormItemSpacer>
                        </>
                      )}
                      {type === "file" && (
                        <>
                          <FormItemSpacer>
                            <Checkbox
                              label="複数ファイルを受け付ける"
                              checked={watch(
                                `items.${index}.accept_multiple_files` as const
                              )}
                              register={register(
                                `items.${index}.accept_multiple_files` as const
                              )}
                            />
                          </FormItemSpacer>
                          <FormItemSpacer>
                            <Checkbox
                              label="必須項目にする"
                              checked={watch(
                                `items.${index}.is_required` as const
                              )}
                              register={register(
                                `items.${index}.is_required` as const
                              )}
                            />
                          </FormItemSpacer>
                        </>
                      )}
                    </Panel>
                  </div>
                  <div className={styles.itemActions}>
                    <Tooltip title="この項目を上に移動" placement="left">
                      <div>
                        <IconButton
                          icon="chevron-up"
                          onClick={() => swapItem(index, index - 1)}
                        />
                      </div>
                    </Tooltip>
                    <Tooltip title="この項目を下に移動" placement="left">
                      <div>
                        <IconButton
                          icon="chevron-down"
                          onClick={() => swapItem(index, index + 1)}
                        />
                      </div>
                    </Tooltip>
                    <Tooltip title="この項目を削除" placement="left">
                      <div>
                        <IconButton
                          icon="trash-alt"
                          danger={true}
                          onClick={() => removeItem(index)}
                        />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )
            })}
            <div className={styles.addItemWrapper}>
              <div className={styles.addButton}>
                <Button
                  icon="plus"
                  kind="secondary"
                  onClick={() => {
                    addItem("text")
                  }}
                >
                  テキスト項目
                </Button>
              </div>
              <div className={styles.addButton}>
                <Button
                  icon="plus"
                  kind="secondary"
                  onClick={() => {
                    addItem("checkbox")
                  }}
                >
                  チェックボックス項目
                </Button>
              </div>
              <div className={styles.addButton}>
                <Button
                  icon="plus"
                  kind="secondary"
                  onClick={() => {
                    addItem("radio")
                  }}
                >
                  ドロップダウン項目
                </Button>
              </div>
              <div className={styles.addButton}>
                <Button
                  icon="plus"
                  kind="secondary"
                  onClick={() => {
                    addItem("file")
                  }}
                >
                  ファイル項目
                </Button>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            icon="paper-plane"
            processing={processing}
            fullWidth={true}
          >
            申請を更新する
          </Button>
        </form>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            <>
              {(() => {
                if (error === "notFound") {
                  return <p>申請が見つかりませんでした</p>
                }

                if (error === "alreadyStarted") {
                  return <p>既に回答が開始されている申請です</p>
                }

                if (error === "unknown") {
                  return <p>エラーが発生しました</p>
                }

                return <Spinner />
              })()}
            </>
          </div>
        </Panel>
      )}
    </div>
  )
}
EditForm.layout = "committee"
EditForm.rbpac = { type: "higherThanIncluding", role: "committee_operator" }

export default EditForm
// function useFieldArray(arg0: { control: any; name: string }): { fields: any; append: any; remove: any; swap: any } {
//   throw new Error("Function not implemented.")
// }
