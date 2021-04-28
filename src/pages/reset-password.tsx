import { useState } from "react"

import { PageFC } from "next"

import { useForm } from "react-hook-form"

import { useAuthNeue } from "../contexts/auth"

import { Button, FormItemSpacer, TextField, Panel } from "../components"

import styles from "./reset-password.module.scss"

type  Inputs = Readonly<{
  email: string
}>

const ResetPassword: PageFC = () => {
  const [processing, setProcessing] = useState(false)
  const [unknownError, setUnknownError] = useState(false)
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<
    undefined | "mailReSent" | "mailSent" | "error"
  >(undefined)

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const { sendPasswordResetEmail, sendEmailVerification } = useAuthNeue()

  const resendVerification = () => {
    setProcessing(true)

    sendEmailVerification()
      .then(() => {
        setProcessing(false)
        setEmailVerificationStatus("mailSent")
      })
      .catch((err) => {
        setProcessing(false)
        setEmailVerificationStatus("error")
        console.error(err)
      })
  }

  const onSubmit = async ({ email }: Inputs) => {
    setProcessing(true)
    await sendPasswordResetEmail(email)
      .then(() => {
        sendEmailVerification()
          .then(() => {
            setProcessing(false)
            setEmailVerificationStatus("mailSent")
          })
          .catch((err) => {
            setProcessing(false)
            setEmailVerificationStatus("error")
            console.error(err)
          })
      })
      .catch((res) => {
        setProcessing(false)
        if (res.code === "auth/invalid-email") {
          setError(
            "email",
            {
              type: "invalidEmail",
            },
            { shouldFocus: true }
          )
        } else if (res.code === "auth/user-not-found") {
          setError(
            "email",
            {
              type: "userNotFound",
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
        {emailVerificationStatus === "mailSent" && (
            <>
              <h1 className={styles.title}>
                メールアドレスの確認をお願いします
              </h1>
              <p className={styles.description}>
                登録されたメールアドレスにパスワードをリセットするためのメールをお送りしています
              </p>
              <p className={styles.description}>
                メールに記載されたリンクをクリックしてパスワードをリセットしてください
              </p>
              {/* TODO: アドレスを本番環境のものに差し替え */}
              <p className={styles.description}>
                受信できない場合、noreply@hoge.firebaseapp.comからのメールが迷惑メールフォルダに配信されていないかご確認ください
              </p>
              <p className={styles.description}>
                下のボタンから確認メールを再送することができます
              </p>
              <div className={styles.resendWrapper}>
                <Button
                  kind="secondary"
                  size="small"
                  processing={processing}
                  icon="paper-plane"
                  onClick={resendVerification}
                  fullWidth={true}
                >
                  確認メールを再送する
                </Button>
              </div>
            </>
          )}
          {emailVerificationStatus === "mailReSent" && (
            <>
              <h1 className={styles.title}>確認メールを再送しました</h1>
              <p className={styles.description}>
                メールに記載されたリンクをクリックしてリセットを完了してください
              </p>
            </>
          )}
          {emailVerificationStatus === "error" && (
            <>
              <h1 className={styles.title}>確認メールを再送できませんでした</h1>
              <p className={styles.description}>管理者にお問い合わせください</p>
              {/* TODO: 問い合わせへの動線 */}
            </>
          )}
          {!emailVerificationStatus && (
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <legend className={styles.legend}>パスワードをリセット</legend>
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
                      errors?.email?.type === "userNotFound" &&
                        "ユーザーが見つかりません",
                    ]}
                    placeholder="xxx@s.tsukuba.ac.jp"
                    required
                    register={register("email", {
                      required: true,
                      pattern: /^[\w\-._]+@([\w\-._]+\.)?tsukuba\.ac\.jp$/,
                    })}
                  />
                </FormItemSpacer>
              </fieldset>
              <div className={styles.submitButton}>
                <Button
                  type="submit"
                  processing={processing}
                  icon="inbox-f"
                  fullWidth={true}
                >
                  メールを送信する
                </Button>
              </div>
              {unknownError && (
                <div className={styles.error}>
                  <p>不明なエラーが発生しました</p>
                  <p>時間をおいて再度お試しください</p>
                </div>
              )}
            </form>
          )}
        </Panel>
      </div>
    </div>
  )
}
ResetPassword.layout = "default"
ResetPassword.rbpac = { type: "lowerThanIncluding", role: "guest"}

export default ResetPassword
