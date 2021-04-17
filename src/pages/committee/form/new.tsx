import { PageFC } from "next"

import { useForm } from "react-hook-form"

import type {
  ProjectCategory,
  ProjectAttribute,
} from "../../../types/models/project"

import {
  Button,
  FormItemSpacer,
  Panel,
  ProjectQuerySelector,
  Textarea,
  TextField,
} from "../../../components/"

import styles from "./new.module.scss"

type ProjectQueryState = {
  [key in ProjectCategory]: boolean
} &
  { [key in ProjectAttribute]: boolean }

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
}

const NewForm: PageFC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<Inputs>({
    mode: "onBlur",
    criteriaMode: "all",
  })

  const onSubmit = (data: Inputs) => {
    console.log(data)
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
          <Button
            icon="plus-circle"
            kind="secondary"
            buttonRestAttributes={{ onClick: () => console.log("hoge") }}
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
