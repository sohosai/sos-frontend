import { useState } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { pagesPath } from "../utils/$path"

import { useForm } from "react-hook-form"

import { useAuth } from "../contexts/auth"

import { Button, FormItemSpacer, TextField, Panel } from "../components"

import styles from "./login.module.scss"

type Inputs = Readonly<{
  email: string
  password: string
}>

const Login: PageFC = () => {
  const [processing, setProcessing] = useState(false)
  const [unknownError, setUnknownError] = useState(false)

  const router = useRouter()

  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const { signin } = useAuth()

  const onSubmit = async ({ email, password }: Inputs) => {
    setProcessing(true)
    await signin(email, password)
      .then(() => {
        setProcessing(false)

        // アカウント情報未登録だった場合は auth context 側で /init にリダイレクトしている
        router.push(pagesPath.mypage.$url())
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
                    pattern: /^[\w\-._]+@([\w\-._]+\.)?tsukuba\.ac\.jp$/,
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
                icon="log-in"
                fullWidth={true}
              >
                ログインする
              </Button>
            </div>
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
Login.layout = "default"
Login.rbpac = { type: "lowerThanIncluding", role: "guest" }

export default Login
