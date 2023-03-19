import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { PageFC } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { useForm } from "react-hook-form"

import {
  Button,
  DateTimeSelector,
  FormItemSpacer,
  Head,
  Panel,
  Spinner,
  Textarea,
  TextField,
} from "../../../components/"
import { reportError } from "../../../lib/errorTracking/reportError"

import { pagesPath } from "../../../utils/$path"
import styles from "./edit.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"
import { getForm } from "src/lib/api/form/getForm"
import { updateForm } from "src/lib/api/form/updateForm"

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
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<Inputs>({
    mode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: true,
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
