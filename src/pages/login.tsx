import { useState } from "react"

import { PageFC } from "next"

import { useForm } from "react-hook-form"

import { useAuth } from "../hooks/useAuth"

import { Button, FormItemSpacer, TextField, PasswordField } from "../components"

import styles from "./login.module.scss"

type Inputs = Readonly<{
  email: string
  password: string
}>

const Login: PageFC = () => {
  const [processing, setProcessing] = useState(false)

  const { register, errors, setError, handleSubmit } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const { signin } = useAuth()

  const onSubmit = async ({ email, password }: Inputs) => {
    setProcessing(true)
    await signin(email, password)
      .then(() => {
        setProcessing(false)
        // TODO: リダイレクトなど
      })
      .catch((res) => {
        setProcessing(false)
        if (res.code === "auth/wrong-password") {
          setError("password", {
            type: "wrongPassword",
          })
        } else if (res.code === "auth/user-not-found") {
          setError("email", {
            type: "userNotFound",
          })
        }
      })
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <FormItemSpacer>
          <TextField
            label="メールアドレス"
            name="email"
            autocomplete="email"
            description={[
              "tsukuba.ac.jpで終わるメールアドレスを使用してください",
            ]}
            error={[
              errors?.email?.types?.required && "必須項目です",
              errors?.email?.types?.pattern && "使用できないメールアドレスです",
              errors?.email?.type === "userNotFound" &&
                "このメールアドレスで登録されたユーザーが存在しません",
            ]}
            required
            register={register({
              required: true,
              pattern: /^[\w\-._]+@([\w\-._]+\.)?tsukuba\.ac\.jp$/,
            })}
          />
        </FormItemSpacer>
        <FormItemSpacer>
          <PasswordField
            label="パスワード"
            name="password"
            autocomplete="current-password"
            error={[
              errors?.password?.types?.required && "必須項目です",
              errors?.password?.type === "wrongPassword" &&
                "パスワードが一致しません",
            ]}
            required
            register={register({
              required: true,
            })}
          />
        </FormItemSpacer>
        <Button type="submit" processing={processing}>
          ログインする
        </Button>
      </form>
    </div>
  )
}
Login.layout = "default"

export default Login
