import { PageFC } from "next"

import { useForm, useFieldArray } from "react-hook-form"

import { v4 as uuid } from "uuid"

import type {
  ProjectCategory,
  ProjectAttribute,
} from "../../../types/models/project"
import type { FormItem } from "../../../types/models/form/item"

import {
  Button,
  Checkbox,
  Dropdown,
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
  items: FormItem[]
}

const NewForm: PageFC = () => {
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

  const onSubmit = (data: Inputs) => {
    if (process.browser && window.confirm("申請を対象の企画に送信しますか?")) {
      console.log(data)
    }
  }

  const addItem = () => {
    append({
      id: uuid(),
      type: "text",
    })
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
              <Textarea label="申請の説明" />
            </FormItemSpacer>
            <FormItemSpacer>
              <div className={styles.dateTimeInputWrapper}>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="1"
                    max="12"
                    // TODO: 現在日時から入れる
                    defaultValue="5"
                    label="開始日"
                    required
                    inputRestAttributes={register("starts_at.month", {
                      required: true,
                    })}
                  />
                  <p className={styles.dateTimeInputLabel}>月</p>
                </div>
                <p className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="1"
                    max="31"
                    // TODO: 現在日時から入れる
                    defaultValue="1"
                    required
                    inputRestAttributes={register("starts_at.day", {
                      required: true,
                    })}
                  />
                  <p className={styles.dateTimeInputLabel}>日</p>
                </p>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="0"
                    max="23"
                    defaultValue="12"
                    label="開始時間"
                    required
                    inputRestAttributes={register("starts_at.hour", {
                      required: true,
                    })}
                  />
                  <p className={styles.dateTimeInputLabel}>時</p>
                </div>
                <p className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="0"
                    max="59"
                    defaultValue="0"
                    required
                    inputRestAttributes={register("starts_at.minute", {
                      required: true,
                    })}
                  />
                  <p className={styles.dateTimeInputLabel}>分</p>
                </p>
              </div>
            </FormItemSpacer>
            <FormItemSpacer marginBottom={0}>
              <div className={styles.dateTimeInputWrapper}>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="1"
                    max="12"
                    // TODO: 現在日時から入れる
                    defaultValue="5"
                    label="終了日"
                    required
                    inputRestAttributes={register("ends_at.month", {
                      required: true,
                    })}
                  />
                  <p className={styles.dateTimeInputLabel}>月</p>
                </div>
                <p className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="1"
                    max="31"
                    // TODO: 現在日時から入れる
                    defaultValue="1"
                    required
                    inputRestAttributes={register("ends_at.day", {
                      required: true,
                    })}
                  />
                  <p className={styles.dateTimeInputLabel}>日</p>
                </p>
                <div className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="0"
                    max="23"
                    defaultValue="12"
                    label="終了時間"
                    required
                    inputRestAttributes={register("ends_at.hour", {
                      required: true,
                    })}
                  />
                  <p className={styles.dateTimeInputLabel}>時</p>
                </div>
                <p className={styles.dateTimeInputItem}>
                  <TextField
                    type="number"
                    min="0"
                    max="59"
                    defaultValue="0"
                    required
                    inputRestAttributes={register("ends_at.minute", {
                      required: true,
                    })}
                  />
                  <p className={styles.dateTimeInputLabel}>分</p>
                </p>
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
          {fields.map(({ id, type }, index) => (
            <div className={styles.itemWrapper} key={id}>
              <div className={styles.itemPanel}>
                <Panel>
                  <FormItemSpacer>
                    <div className={styles.typeSelector}>
                      <Dropdown
                        label="回答タイプ"
                        required
                        options={[{ value: "text", label: "テキスト" }]}
                      />
                    </div>
                  </FormItemSpacer>
                  <FormItemSpacer>
                    <TextField
                      type="text"
                      label="質問の名前"
                      required
                      error={[
                        errors?.items?.[index]?.name?.types?.required &&
                          "必須項目です",
                      ]}
                      {...register(`items.${index}.name` as const, {
                        required: true,
                      })}
                    />
                  </FormItemSpacer>
                  <FormItemSpacer>
                    <Textarea
                      label="説明"
                      rows={2}
                      error={[
                        errors?.items?.[index]?.description?.types?.maxLength &&
                          "500字以内で入力してください",
                      ]}
                      {...register(`items.${index}.description` as const, {
                        maxLength: 500,
                      })}
                    />
                  </FormItemSpacer>
                  {type === "text" && (
                    <>
                      <FormItemSpacer>
                        <Checkbox
                          label="必須項目にする"
                          checked={watch(`items.${index}.is_required` as any)}
                          register={register(
                            `items.${index}.is_required` as const
                          )}
                        />
                      </FormItemSpacer>
                      <FormItemSpacer>
                        <Checkbox
                          label="複数行テキストにする"
                          checked={watch(
                            `items.${index}.accept_multiple_lines` as any
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
                              max={500}
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
                              max={500}
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
                          placeholder="サンプルテキストの例"
                          description="入力欄内にサンプルとして表示されるテキストです"
                          {...register(`items.${index}.placeholder` as const)}
                        />
                      </FormItemSpacer>
                    </>
                  )}
                </Panel>
              </div>
              <div className={styles.itemActions}>
                <IconButton
                  icon="chevron-up"
                  onClick={() => swapItem(index, index - 1)}
                />
                <IconButton
                  icon="chevron-down"
                  onClick={() => swapItem(index, index + 1)}
                />
                <IconButton
                  icon="trash-alt"
                  onClick={() => removeItem(index)}
                />
              </div>
            </div>
          ))}
          <Button
            icon="plus-circle"
            kind="secondary"
            buttonRestAttributes={{
              onClick: addItem,
            }}
          >
            質問項目を追加
          </Button>
        </div>
        <Button type="submit" icon="paper-plane">
          申請を送信する
        </Button>
      </form>
    </div>
  )
}
NewForm.layout = "committee"
NewForm.rbpac = { type: "higherThanIncluding", role: "committee" }

export default NewForm
