import { PageFC } from "next"
import { useState } from "react"

import { useForm } from "react-hook-form"

import { Button, FormItemSpacer, Head, TextField, Panel } from "../components"
import styles from "./reset-password.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

type Inputs = Readonly<{
  email: string
}>

const ResetPassword: PageFC = () => {
  const [processing, setProcessing] = useState(false)
  const [mailSent, setMailSent] = useState(false)

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const { sendPasswordResetEmail } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const onSubmit = async ({ email }: Inputs) => {
    setProcessing(true)
    await sendPasswordResetEmail(email)
      .then(() => {
        setProcessing(false)
        setMailSent(true)
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
          addToast({
            title: "エラーが発生しました",
            descriptions: ["時間をおいて再度お試しください"],
            kind: "error",
          })
        }
      })
  }

  return (
    <div className={styles.wrapper}>
      <Head title="パスワードの再設定" />
      <div className={styles.formWrapper}>
        <Panel style={{ padding: "48px" }}>
          {mailSent ? (
            <>
              <h1 className={styles.title}>メールをお送りしました</h1>
              <p className={styles.description}>
                入力されたメールアドレスにパスワードを再設定するためのメールをお送りしています
              </p>
              <p className={styles.description}>
                メールに記載されたリンクをクリックしてパスワードを再設定してください
              </p>
              <p className={styles.description}>
                受信できない場合、noreply@
                {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
                からのメールが迷惑メールフォルダに配信されていないかご確認ください
              </p>
            </>
          ) : (
            <form
              className={styles.form}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <fieldset>
                <legend className={styles.legend}>パスワードの再設定</legend>
                <FormItemSpacer>
                  <TextField
                    type="email"
                    label="メールアドレス"
                    autoComplete="email"
                    description={[
                      "tsukuba.ac.jp、またはsohosai.comで終わるメールアドレスを使用してください",
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
                    placeholder="xxx@u.tsukuba.ac.jp"
                    required
                    register={register("email", {
                      required: true,
                      pattern:
                        /^[\w\-._]+@([\w\-._]+\.)?(tsukuba\.ac\.jp|sohosai\.com)$/,
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
                  再設定用メールを送信する
                </Button>
              </div>
            </form>
          )}
        </Panel>
      </div>
    </div>
  )
}
ResetPassword.layout = "default"
ResetPassword.rbpac = { type: "lowerThanIncluding", role: "guest" }

export default ResetPassword
