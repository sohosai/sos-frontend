import { useState } from "react"

import { PageFC } from "next"

import { useForm } from "react-hook-form"

import { signup } from "../lib/api/signup"

import { useAuth } from "../hooks/useAuth"

import { Panel, FormItemSpacer, TextField, Button } from "../components"

import { isKana, katakanaToHiragana } from "../utils/jpKana"

import styles from "./init.module.scss"

type Inputs = Readonly<{
  nameFirst: string
  nameLast: string
  kanaNameFirst: string
  kanaNameLast: string
  phoneNumber: string
  affiliation: string
}>

const Init: PageFC = () => {
  const [processing, setProcessing] = useState(false)
  const [unknownError, setUnknownError] = useState(false)

  const { idToken } = useAuth()

  const { register, errors, handleSubmit } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const onSubmit = ({
    nameFirst,
    nameLast,
    kanaNameFirst,
    kanaNameLast,
    phoneNumber,
    affiliation,
  }: Inputs) => {
    setProcessing(true)

    signup({
      props: {
        name: {
          first: nameFirst,
          last: nameLast,
        },
        kana_name: {
          first: katakanaToHiragana(kanaNameFirst),
          last: katakanaToHiragana(kanaNameLast),
        },
        phone_number: phoneNumber.replaceAll("-", ""),
        affiliation,
      },
      idToken,
    })
      .then((res) => {
        setProcessing(false)
        // TODO:
        console.log(res)
      })
      .catch((err) => {
        setProcessing(false)
        // TODO:
        console.error(err)
        setUnknownError(true)
      })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.formWrapper}>
        <Panel padding="48px">
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend className={styles.legend}>アカウント情報登録</legend>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="姓"
                  name="nameLast"
                  placeholder="雙峰"
                  autocomplete="family-name"
                  error={[errors?.nameLast?.types?.required && "必須項目です"]}
                  required
                  register={register({
                    required: true,
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="名前"
                  name="nameFirst"
                  placeholder="太郎"
                  autocomplete="given-name"
                  error={[errors?.nameFirst?.types?.required && "必須項目です"]}
                  required
                  register={register({
                    required: true,
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="姓(ふりがな)"
                  name="kanaNameLast"
                  placeholder="そうほう"
                  error={[
                    errors?.kanaNameLast?.types?.required && "必須項目です",
                    errors?.kanaNameLast?.types?.isKana &&
                      "ひらがなで入力してください",
                  ]}
                  required
                  register={register({
                    required: true,
                    validate: {
                      isKana: (value) => isKana(value),
                    },
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="名前(ふりがな)"
                  name="kanaNameFirst"
                  placeholder="たろう"
                  error={[
                    errors?.kanaNameFirst?.types?.required && "必須項目です",
                    errors?.kanaNameFirst?.types?.isKana &&
                      "ひらがなで入力してください",
                  ]}
                  required
                  register={register({
                    required: true,
                    validate: {
                      isKana: (value) => isKana(value),
                    },
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="電話番号"
                  name="phoneNumber"
                  autocomplete="tel-national"
                  description="雙峰祭当日などに連絡の取れる番号を入力してください"
                  placeholder="08004794581"
                  error={[
                    errors?.phoneNumber?.types?.required && "必須項目です",
                    errors?.phoneNumber?.types?.pattern && "無効な電話番号です",
                  ]}
                  required
                  register={register({
                    required: true,
                    pattern: /^(0\d{2,3}-\d{1,4}-\d{4}|0\d{9,10})$/,
                  })}
                />
              </FormItemSpacer>
              {/* TODO: ドロップダウンか何かにする */}
              <FormItemSpacer>
                <TextField
                  type="text"
                  label="所属学群・学類 "
                  name="affiliation"
                  placeholder="〇〇学群 〇〇学類"
                  error={[
                    errors?.affiliation?.types?.required && "必須項目です",
                  ]}
                  required
                  register={register({
                    required: true,
                  })}
                />
              </FormItemSpacer>
            </fieldset>
            <Button type="submit" processing={processing}>
              情報を登録する
            </Button>
            {unknownError && (
              <div className={styles.error}>
                <p>不明なエラーが発生しました</p>
                <p>時間をおいて再度お試しください</p>
              </div>
            )}
          </form>
        </Panel>
      </div>
    </div>
  )
}
Init.layout = "default"

export default Init
