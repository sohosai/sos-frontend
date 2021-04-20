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
import type {
  FormItem,
  FormItemInFormEditor,
} from "../../../types/models/form/item"

import { createForm } from "../../../lib/api/form/createForm"

import { useAuth } from "../../../contexts/auth"

import { pagesPath } from "../../../utils/$path"

import {
  Button,
  Checkbox,
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
  items: FormItemInFormEditor[]
  // items: FormItem[]
}

const NewForm: PageFC = () => {
  const { idToken } = useAuth()

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
    items,
  }: Inputs) => {
    if (!idToken) throw new Error("idToken must not be null")

    setError(undefined)

    if (!items.length) {
      setError("質問項目を追加してください")
      return
    }

    // FIXME: FormItem[]
    const normalizedItems: any = items.map((item) => {
      return {
        ...item,
        ...(item.type === "text"
          ? {
              min_length: parseInt(item.min_length),
              max_length: parseInt(item.max_length),
            }
          : {}),
        ...(item.type === "checkbox"
          ? {
              boxes: item.boxes
                .split("\n")
                .map((label) => {
                  if (!label) return
                  return {
                    id: uuid(),
                    label,
                  }
                })
                .filter((box): box is { id: string; label: string } =>
                  Boolean(box)
                ),
              min_checks: parseInt(item.min_checks),
              max_checks: parseInt(item.max_checks),
            }
          : {}),
      }
    })

    const attributesArray = Object.entries(attributes)
      .map(([attribute, value]) => {
        if (!value) return
        return attribute
      })
      .filter((nullable): nullable is ProjectAttribute => Boolean(nullable))

    const query = Object.entries(categories)
      .map(([category, value]) => {
        if (!value || !category) return
        return {
          category: category as ProjectCategory,
          attributes: attributesArray,
        }
      })
      .filter((nullable): nullable is {
        category: ProjectCategory
        attributes: ProjectAttribute[]
      } => Boolean(nullable))

    const nonEmptyQuery: ProjectQuery = query.length
      ? query
      : [{ category: null, attributes: attributesArray }]

    if (process.browser && window.confirm("申請を対象の企画に送信しますか?")) {
      setProcessing(true)

      await createForm({
        props: {
          name: title,
          description: description ?? "",
          starts_at: dayjs
            .tz(
              `${starts_at.month}-${starts_at.day}--${starts_at.hour}-${starts_at.minute}`,
              "M-D--H-m",
              "Asia/Tokyo"
            )
            .valueOf(),
          ends_at: dayjs
            .tz(
              `${ends_at.month}-${ends_at.day}--${ends_at.hour}-${ends_at.minute}`,
              "M-D--H-m",
              "Asia/Tokyo"
            )
            .valueOf(),
          condition: {
            query: nonEmptyQuery,
            // TODO:
            includes: [],
            excludes: [],
          },
          items: normalizedItems,
          // items,
        },
        idToken,
      })
        .catch(async (err) => {
          setProcessing(false)
          // TODO: err handling
          setUnknownError(true)
          const body = await err.response.json()
          throw body ? body : err
        })
        .then(async (res) => {
          setProcessing(false)

          console.log(res)

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
          boxes: "",
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
                inputRestAttributes={register("title", {
                  required: true,
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
                {...register("description", {
                  maxLength: 1024,
                })}
              />
            </FormItemSpacer>
            <FormItemSpacer>
              <p className={styles.dateTimeInputLabel}>回答開始日時</p>
              <div className={styles.dateTimeInputWrapper}>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="1"
                    max="12"
                    defaultValue={dayjs().format("M")}
                    label="月"
                    error={[
                      errors.starts_at?.month?.types?.required &&
                        "必須項目です",
                      errors.starts_at?.month?.types?.min && "不正な値です",
                      errors.starts_at?.month?.types?.max && "不正な値です",
                    ]}
                    required
                    inputRestAttributes={register("starts_at.month", {
                      required: true,
                      min: 1,
                      max: 12,
                    })}
                  />
                </div>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="1"
                    max="31"
                    defaultValue={dayjs().format("D")}
                    label="日"
                    error={[
                      errors.starts_at?.day?.types?.required && "必須項目です",
                      errors.starts_at?.day?.types?.min && "不正な値です",
                      errors.starts_at?.day?.types?.max && "不正な値です",
                    ]}
                    required
                    inputRestAttributes={register("starts_at.day", {
                      required: true,
                      min: 1,
                      max: 31,
                    })}
                  />
                </div>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="0"
                    max="23"
                    defaultValue="12"
                    label="時"
                    error={[
                      errors.starts_at?.hour?.types?.required && "必須項目です",
                      errors.starts_at?.hour?.types?.min && "不正な値です",
                      errors.starts_at?.hour?.types?.max && "不正な値です",
                    ]}
                    required
                    inputRestAttributes={register("starts_at.hour", {
                      required: true,
                      min: 0,
                      max: 23,
                    })}
                  />
                </div>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="0"
                    max="59"
                    defaultValue="0"
                    label="分"
                    error={[
                      errors.starts_at?.minute?.types?.required &&
                        "必須項目です",
                      errors.starts_at?.minute?.types?.min && "不正な値です",
                      errors.starts_at?.minute?.types?.max && "不正な値です",
                    ]}
                    required
                    inputRestAttributes={register("starts_at.minute", {
                      required: true,
                      min: 0,
                      max: 59,
                    })}
                  />
                </div>
              </div>
            </FormItemSpacer>
            <FormItemSpacer>
              <p className={styles.dateTimeInputLabel}>回答終了日時</p>
              <div className={styles.dateTimeInputWrapper}>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="1"
                    max="12"
                    defaultValue={dayjs().add(7, "day").format("M")}
                    label="月"
                    error={[
                      errors.ends_at?.month?.types?.required && "必須項目です",
                      errors.ends_at?.month?.types?.min && "不正な値です",
                      errors.ends_at?.month?.types?.max && "不正な値です",
                    ]}
                    required
                    inputRestAttributes={register("ends_at.month", {
                      required: true,
                      min: 1,
                      max: 12,
                    })}
                  />
                </div>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="1"
                    max="31"
                    defaultValue={dayjs().add(7, "day").format("D")}
                    label="日"
                    error={[
                      errors.ends_at?.day?.types?.required && "必須項目です",
                      errors.ends_at?.day?.types?.min && "不正な値です",
                      errors.ends_at?.day?.types?.max && "不正な値です",
                    ]}
                    required
                    inputRestAttributes={register("ends_at.day", {
                      required: true,
                      min: 1,
                      max: 31,
                    })}
                  />
                </div>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="0"
                    max="23"
                    defaultValue="23"
                    label="時"
                    error={[
                      errors.ends_at?.hour?.types?.required && "必須項目です",
                      errors.ends_at?.hour?.types?.min && "不正な値です",
                      errors.ends_at?.hour?.types?.max && "不正な値です",
                    ]}
                    required
                    inputRestAttributes={register("ends_at.hour", {
                      required: true,
                      min: 0,
                      max: 23,
                    })}
                  />
                </div>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="0"
                    max="59"
                    defaultValue="59"
                    label="分"
                    error={[
                      errors.ends_at?.minute?.types?.required && "必須項目です",
                      errors.ends_at?.minute?.types?.min && "不正な値です",
                      errors.ends_at?.minute?.types?.max && "不正な値です",
                    ]}
                    required
                    inputRestAttributes={register("ends_at.minute", {
                      required: true,
                      min: 0,
                      max: 59,
                    })}
                  />
                </div>
              </div>
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
                        {...register(`items.${index}.name` as const, {
                          required: true,
                          maxLength: 64,
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
                        {...register(`items.${index}.description` as const, {
                          maxLength: 1024,
                        })}
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
                                {...register(
                                  `items.${index}.min_length` as const
                                )}
                              />
                            </div>
                            <div className={styles.twoColumnField}>
                              <TextField
                                type="number"
                                label="最大字数"
                                min={1}
                                max={1024}
                                {...register(
                                  `items.${index}.max_length` as const
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
                            {...register(`items.${index}.placeholder` as const)}
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
                                {...register(
                                  `items.${index}.min_checks` as const
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
                                {...register(
                                  `items.${index}.max_checks` as const
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
                            {...register(`items.${index}.boxes` as const, {
                              required: true,
                              minLength: 1,
                            })}
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
