import { useState } from "react"

import { PageFC } from "next"

import { pagesPath } from "../utils/$path"

import { useForm } from "react-hook-form"

import Link from "next/link"

import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { Button, FormItemSpacer, Head, TextField, Panel } from "../components"

import styles from "./login.module.scss"

type Inputs = Readonly<{
  email: string
  password: string
}>

const Login: PageFC = () => {
  const [processing, setProcessing] = useState(false)

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const { signin } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const onSubmit = async ({ email, password }: Inputs) => {
    setProcessing(true)
    await signin(email, password)
      .then(() => {
        setProcessing(false)
      })
      .catch((res) => {
        setProcessing(false)
        if (res.code === "auth/wrong-password") {
          setError(
            "password",
            {
              type: "wrongPassword",
            },
            { shouldFocus: true }
          )
        } else if (res.code === "auth/user-not-found") {
          setError("email", { type: "userNotFound" }, { shouldFocus: true })
        } else if (res.code === "auth/invalid-email") {
          setError("email", { type: "invalidEmail" }, { shouldFocus: true })
        } else if (res.code === "auth/user-disabled") {
          setError(
            "email",
            { type: "userDisabled" },
            {
              shouldFocus: true,
            }
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
      <Head title="ログイン" />
      <div className={styles.formWrapper}>
        <Panel style={{ padding: "48px" }}>
          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <fieldset>
              <legend className={styles.legend}>ログイン</legend>
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
                      "このメールアドレスで登録されたユーザーが存在しません",
                    errors?.email?.type === "userDisabled" &&
                      "アカウントが無効化されています",
                  ]}
                  placeholder="xxx@s.tsukuba.ac.jp"
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
                  autoComplete="current-password"
                  error={[
                    errors?.password?.types?.required && "必須項目です",
                    errors?.password?.type === "wrongPassword" &&
                      "パスワードが一致しません",
                  ]}
                  required
                  register={register("password", { required: true })}
                />
              </FormItemSpacer>
            </fieldset>
            <div className={styles.submitButton}>
              <Button
                type="submit"
                processing={processing}
                icon="log-in-alt"
                fullWidth={true}
              >
                ログインする
              </Button>
            </div>
            <div className={styles.resetPasswordLink}>
              <Link href={pagesPath.reset_password.$url()}>
                <a>パスワードを忘れた方はこちら</a>
              </Link>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  )
}
Login.layout = "default"
Login.rbpac = { type: "lowerThanIncluding", role: "guest" }

export default Login
