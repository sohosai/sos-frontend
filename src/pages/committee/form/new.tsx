import { useEffect, useState } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useForm, useFieldArray } from "react-hook-form"

import { v4 as uuid } from "uuid"

import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import type {
  ProjectCategory,
  ProjectAttribute,
} from "../../../types/models/project"
import type { ProjectQuery } from "../../../types/models/project/projectQuery"
import type { FormItem } from "../../../types/models/form/item"

import { createForm } from "../../../lib/api/form/createForm"

import { useAuthNeue } from "../../../contexts/auth"

import { pagesPath } from "../../../utils/$path"

import {
  Button,
  Checkbox,
  DateTimeSelector,
  FormItemSpacer,
  IconButton,
  Panel,
  ProjectQuerySelector,
  Textarea,
  TextField,
} from "../../../components/"

import styles from "./new.module.scss"

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

const NewForm: PageFC = () => {
  const { authState } = useAuthNeue()

  const router = useRouter()

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [unknownError, setUnknownError] = useState(false)

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
      categories: {
        general: false,
        stage: false,
        cooking: false,
        food: false,
      },
      attributes: {
        academic: false,
        artistic: false,
        outdoor: false,
        committee: false,
      },
      attributesAndOr: "or",
      items: [],
    },
  })

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "items",
  })

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
      setUnknownError(true)
      return
    }

    const idToken = await authState.firebaseUser.getIdToken()

    setError(undefined)

    if (!items.length) {
      setError("質問項目を追加してください")
      return
    }

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

    if (process.browser && window.confirm("申請を対象の企画に送信しますか?")) {
      setProcessing(true)

      await createForm({
        props: {
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
        .catch(async (err) => {
          setProcessing(false)
          // TODO: err handling
          setUnknownError(true)
          const body = await err.response?.json()
          throw body ? body : err
        })
        .then(async () => {
          setProcessing(false)

          router.push(pagesPath.committee.form.$url())
        })
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
          conditions: [],
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
          conditions: [],
          boxes: [],
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

  useEffect(() => {
    dayjs.extend(customParseFormat)
    dayjs.extend(utc)
    dayjs.extend(timezone)
  }, [])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>新しい申請を作成</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
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
                general: watch("categories.general"),
                stage: watch("categories.stage"),
                cooking: watch("categories.cooking"),
                food: watch("categories.food"),
                academic: watch("attributes.academic"),
                artistic: watch("attributes.artistic"),
                outdoor: watch("attributes.outdoor"),
                committee: watch("attributes.committee"),
              }}
              registers={{
                general: register("categories.general"),
                stage: register("categories.stage"),
                cooking: register("categories.cooking"),
                food: register("categories.food"),
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
            const type = watch(`items.${index}.type` as const)
            const itemNamePlaceholders: {
              [itemType in FormItem["type"]]?: string
            } = {
              checkbox: "必要な文房具",
            }
            const itemTypeToUiText = (type: FormItem["type"]) => {
              const dict: { [type in FormItem["type"]]?: string } = {
                text: "テキスト",
                checkbox: "チェックボックス",
              }
              return dict[type]
            }

            return (
              <div className={styles.itemWrapper} key={id}>
                <div className={styles.itemPanel}>
                  <Panel>
                    <p className={styles.itemType}>{itemTypeToUiText(type)}</p>
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
                            defaultChecked={false}
                            checked={watch(`items.${index}.is_required` as any)}
                            register={register(
                              `items.${index}.is_required` as const
                            )}
                          />
                        </FormItemSpacer>
                        <FormItemSpacer>
                          <Checkbox
                            label="複数行テキストにする"
                            defaultChecked={false}
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
                                min={0}
                                max={1024}
                                register={register(
                                  `items.${index}.min_length` as const,
                                  {
                                    valueAsNumber: true,
                                  }
                                )}
                              />
                            </div>
                            <div className={styles.twoColumnField}>
                              <TextField
                                type="number"
                                label="最大字数"
                                min={1}
                                max={1024}
                                register={register(
                                  `items.${index}.max_length` as const,
                                  {
                                    valueAsNumber: true,
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
                                    valueAsNumber: true,
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
                                    valueAsNumber: true,
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
                            placeholder={"マジックペン\nガムテープ\n養生テープ"}
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
                                setValueAs: (value) =>
                                  value
                                    ?.trim()
                                    .split("\n")
                                    .map((label: string) => {
                                      if (!label) return
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
                                    ),
                              }
                            )}
                          />
                        </FormItemSpacer>
                      </>
                    )}
                  </Panel>
                </div>
                <div className={styles.itemActions}>
                  <IconButton
                    icon="chevron-up"
                    title="この項目を上に移動"
                    onClick={() => swapItem(index, index - 1)}
                  />
                  <IconButton
                    icon="chevron-down"
                    title="この項目を下に移動"
                    onClick={() => swapItem(index, index + 1)}
                  />
                  <IconButton
                    icon="trash-alt"
                    title="この項目を削除"
                    danger={true}
                    onClick={() => removeItem(index)}
                  />
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
          </div>
        </div>
        <Button
          type="submit"
          icon="paper-plane"
          processing={processing}
          fullWidth={true}
        >
          申請を送信する
        </Button>
        {unknownError && (
          <p className={styles.errorText}>エラーが発生しました</p>
        )}
        {error && <p className={styles.errorText}>{error}</p>}
      </form>
    </div>
  )
}
NewForm.layout = "committee"
NewForm.rbpac = { type: "higherThanIncluding", role: "committee" }

export default NewForm
