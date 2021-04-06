import { useState } from "react"

import { PageFC } from "next"

import { useForm } from "react-hook-form"

import { useAuth } from "../contexts/auth"

import { Button, FormItemSpacer, TextField, Panel } from "../components"

import styles from "./signup.module.scss"

type Inputs = Readonly<{
  email: string
  password: string
}>

const Signup: PageFC = () => {
  const [processing, setProcessing] = useState(false)
  const [unknownError, setUnknownError] = useState(false)

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const { signup, sendEmailVerification } = useAuth()

  const onSubmit = async ({ email, password }: Inputs) => {
    setProcessing(true)
    await signup(email, password)
      .then(() => {
        sendEmailVerification()
          .then(() => {
            setProcessing(false)
          })
          .catch((err) => {
            setProcessing(false)
            console.error(err)
          })
      })
      .catch((res) => {
        setProcessing(false)
        if (res.code === "auth/email-already-in-use") {
          setError("email", {
            type: "emailAlreadyInUse",
          })
        } else if (res.code === "auth/invalid-email") {
          setError(
            "email",
            {
              type: "invalidEmail",
            },
            { shouldFocus: true }
          )
        } else if (res.code === "auth/weak-password") {
          setError(
            "password",
            {
              type: "weakPassword",
            },
            { shouldFocus: true }
          )
        } else {
          setUnknownError(true)
        }
      })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.formWrapper}>
        <Panel style={{ padding: "48px" }}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend className={styles.legend}>アカウント登録</legend>
              <FormItemSpacer>
                <TextField
                  type="email"
                  label="メールアドレス"
                  autocomplete="email"
                  description={[
                    "tsukuba.ac.jpで終わるメールアドレスを使用してください",
                  ]}
                  error={[
                    errors?.email?.types?.required && "必須項目です",
                    errors?.email?.types?.pattern &&
                      "使用できないメールアドレスです",
                    errors?.email?.type === "invalidEmail" &&
                      "使用できないメールアドレスです",
                    errors?.email?.type === "emailAlreadyInUse" &&
                      "このメールアドレスはアカウント登録済みです",
                  ]}
                  placeholder="xxx@s.tsukuba.ac.jp"
                  required
                  inputRestAttributes={register("email", {
                    required: true,
                    pattern: /^[\w\-._]+@([\w\-._]+\.)?tsukuba\.ac\.jp$/,
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="password"
                  label="パスワード"
                  autocomplete="new-password"
                  description="アルファベットと数字の両方を含む8文字以上で設定してください"
                  error={[
                    errors?.password?.types?.required && "必須項目です",
                    errors?.password?.types?.minLength &&
                      "8文字以上で入力してください",
                    errors?.password?.types?.maxLength &&
                      "128文字以内で入力してください",
                    errors?.password?.types?.containsNumber &&
                      "数字を含めてください",
                    errors?.password?.types?.containsAlphabet &&
                      "アルファベットを含めてください",
                    errors?.password?.types?.safeChars &&
                      "使用できない文字が含まれています",
                    errors?.password?.type === "weakPassword" &&
                      "パスワードが単純すぎます",
                  ]}
                  required
                  inputRestAttributes={register("password", {
                    required: true,
                    minLength: 8,
                    maxLength: 128,
                    validate: {
                      containsNumber: (value) => /\d/.test(value),
                      containsAlphabet: (value) => /[A-z]/.test(value),
                      safeChars: (value) =>
                        /^[A-z0-9~!?@#$%^&*_\-+()[\]{}></\\|"'.,:;]*$/.test(
                          value
                        ),
                    },
                  })}
                />
              </FormItemSpacer>
            </fieldset>
            <Button type="submit" processing={processing}>
              アカウント登録する
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
Signup.layout = "default"
Signup.rbpac = { type: "lowerThanIncluding", role: "guest" }

export default Signup
