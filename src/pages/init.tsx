import { PageFC } from "next"
import { useRouter } from "next/router"
import { useState } from "react"

import { useForm } from "react-hook-form"

import {
  Panel,
  FormItemSpacer,
  Head,
  TextField,
  Button,
  Dropdown,
} from "../components"
import type { UserType } from "../types/models/user"

import { pagesPath } from "../utils/$path"
import { isKana, katakanaToHiragana } from "../utils/jpKana"
import styles from "./init.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { reportError } from "src/lib/errorTracking/reportError"

type Inputs = Readonly<{
  nameFirst: string
  nameLast: string
  kanaNameFirst: string
  kanaNameLast: string
  phoneNumber: string
  type: UserType
}>

const Init: PageFC = () => {
  const [processing, setProcessing] = useState(false)

  const { initSosUser } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const onSubmit = async ({
    nameFirst,
    nameLast,
    kanaNameFirst,
    kanaNameLast,
    phoneNumber,
    type,
  }: Inputs) => {
    setProcessing(true)

    const requestBody = {
      name: {
        first: nameFirst,
        last: nameLast,
      },
      kana_name: {
        first: katakanaToHiragana(kanaNameFirst),
        last: katakanaToHiragana(kanaNameLast),
      },
      phone_number: "+81" + phoneNumber.replaceAll("-", "").slice(1),
      type,
    }

    try {
      const res = await initSosUser(requestBody)

      if ("errorCode" in res) {
        addToast({ title: "エラーが発生しました", kind: "error" })
        reportError("failed to init user", {
          requestBody,
          error: res,
        })
      }

      setProcessing(false)
    } catch (err) {
      setProcessing(false)

      // FIXME: any
      const body = await (err as any).response?.json()

      if (!body) {
        addToast({ title: "エラーが発生しました", kind: "error" })
        reportError("failed to init user with unknown error", {
          requestBody,
          error: err,
        })
      }

      switch (String(body.status)) {
        case "400": {
          switch (body.error.type) {
            case "API": {
              if (body.error.info.type === "INVALID_FIELD") {
                addToast({
                  title: "入力内容が正しくありません",
                  kind: "error",
                })
                reportError("failed to init user with INVALID_FIELD", {
                  requestBody,
                  error: body,
                })
                return
              }
            }
          }
          break
        }
        case "409": {
          addToast({
            title: "このアカウントの情報は登録済みです",
            kind: "error",
          })
          router.push(pagesPath.me.$url())
          return
        }
      }

      addToast({ title: "エラーが発生しました", kind: "error" })
      reportError("failed to init user", {
        requestBody,
        error: body,
      })
    }
  }

  return (
    <div className={styles.wrapper}>
      <Head title="アカウント情報登録" />
      <div className={styles.formWrapper}>
        <Panel style={{ padding: "48px" }}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <fieldset>
              <legend className={styles.legend}>アカウント情報登録</legend>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="姓"
                  placeholder="雙峰"
                  autoComplete="family-name"
                  error={[errors?.nameLast?.types?.required && "必須項目です"]}
                  required
                  register={register("nameLast", {
                    required: true,
                    setValueAs: (value) => value?.trim(),
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="姓(ふりがな)"
                  placeholder="そうほう"
                  error={[
                    errors?.kanaNameLast?.types?.required && "必須項目です",
                    errors?.kanaNameLast?.types?.isKana &&
                      "ひらがなで入力してください",
                  ]}
                  required
                  register={register("kanaNameLast", {
                    required: true,
                    validate: {
                      isKana: (value) => isKana(value),
                    },
                    setValueAs: (value) => value?.trim(),
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="名前"
                  placeholder="太郎"
                  autoComplete="given-name"
                  error={[errors?.nameFirst?.types?.required && "必須項目です"]}
                  required
                  register={register("nameFirst", {
                    required: true,
                    setValueAs: (value) => value?.trim(),
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="名前(ふりがな)"
                  placeholder="たろう"
                  error={[
                    errors?.kanaNameFirst?.types?.required && "必須項目です",
                    errors?.kanaNameFirst?.types?.isKana &&
                      "ひらがなで入力してください",
                  ]}
                  required
                  register={register("kanaNameFirst", {
                    required: true,
                    validate: {
                      isKana: (value) => isKana(value),
                    },
                    setValueAs: (value) => value?.trim(),
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="電話番号"
                  autoComplete="tel-national"
                  description="雙峰祭当日などに連絡の取れる番号を入力してください"
                  placeholder="08004794581"
                  error={[
                    errors?.phoneNumber?.types?.required && "必須項目です",
                    errors?.phoneNumber?.types?.pattern && "無効な電話番号です",
                  ]}
                  required
                  register={register("phoneNumber", {
                    required: true,
                    pattern: /^(0\d{2,3}-\d{1,4}-\d{4}|0\d{9,10})$/,
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <Dropdown
                  label="区分"
                  defaultValue=""
                  options={[
                    { value: "", label: "選択してください" },
                    { value: "undergraduate_student", label: "学群生" },
                    { value: "graduate_student", label: "院生" },
                    { value: "academic_staff", label: "教職員" },
                  ]}
                  error={[errors?.type?.types?.required && "必須項目です"]}
                  required
                  register={register("type", {
                    required: true,
                  })}
                />
              </FormItemSpacer>
            </fieldset>
            <div className={styles.submitButton}>
              <Button
                type="submit"
                processing={processing}
                icon="paper-plane"
                fullWidth={true}
              >
                情報を登録する
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  )
}
Init.layout = "default"
Init.rbpac = { type: "lowerThanIncluding", role: "guest" }

export default Init
