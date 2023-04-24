import { PageFC } from "next"
import { useState } from "react"

import { useForm } from "react-hook-form"

import { Button, FormItemSpacer, Head, TextField, Panel } from "../components"
import styles from "./signup.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { reportError } from "src/lib/errorTracking/reportError"

type Inputs = Readonly<{
  email: string
  password: string
}>

const Signup: PageFC = () => {
  const [processing, setProcessing] = useState(false)

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
    watch,
  } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const { signup, sendEmailVerification } = useAuthNeue()
  const { addToast } = useToastDispatcher()

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
            addToast({
              title: "確認メールを送信できませんでした",
              kind: "error",
            })
            reportError("failed to send email verification email", {
              error: err,
            })
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
          addToast({
            title: "エラーが発生しました",
            descriptions: ["時間をおいて再度お試しください"],
            kind: "error",
          })
        }
      })
  }

  const email = watch().email
  const emailWarning = email
    ? !watch().email.match(/^s[012][0-9]{6}@/) &&
      watch().email.match(/@s\.tsukuba\.ac\.jp/)
      ? "invalidSAddress"
      : null
    : null

  return (
    <div className={styles.wrapper}>
      <Head title="ユーザー登録" />
      <div className={styles.formWrapper}>
        <Panel style={{ padding: "48px" }}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <fieldset>
              <legend className={styles.legend}>ユーザー登録</legend>
              <FormItemSpacer>
                <TextField
                  type="email"
                  label="メールアドレス"
                  autoComplete="email"
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
                      "このメールアドレスはユーザー登録済みです",
                  ]}
                  warning={[
                    emailWarning === "invalidSAddress" &&
                      "学生に発行されたsアドレスではない可能性があります。\nこのまま実行しますか？",
                  ]}
                  placeholder="xxx@u.tsukuba.ac.jp"
                  required
                  register={register("email", {
                    required: true,
                    pattern:
                      process.env.NEXT_PUBLIC_DEPLOY_ENV === "dev"
                        ? /^[\w\-._+]+@([\w\-._]+\.)?tsukuba\.ac\.jp$/
                        : /^[\w\-._]+@([\w\-._]+\.)?tsukuba\.ac\.jp$/,
                  })}
                />
              </FormItemSpacer>
              <FormItemSpacer>
                <TextField
                  type="password"
                  label="パスワード"
                  autoComplete="new-password"
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
                  register={register("password", {
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
            <div className={styles.submitButton}>
              <Button
                type="submit"
                processing={processing}
                icon="user-plus"
                fullWidth={true}
              >
                登録する
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  )
}
Signup.layout = "default"
Signup.rbpac = { type: "lowerThanIncluding", role: "guest" }

export default Signup
