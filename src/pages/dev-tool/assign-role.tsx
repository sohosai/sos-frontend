import { PageFC } from "next"
import { useState } from "react"

import { useForm } from "react-hook-form"

import {
  Button,
  Dropdown,
  FormItemSpacer,
  Head,
  Panel,
  TextField,
} from "../../components"
import { assignUserRoleToEmail } from "../../lib/api/user/assignUserRoleToEmail"
import { reportError } from "../../lib/errorTracking/reportError"

import styles from "./assign-role.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

type Inputs = {
  email: string
  role: string
}

const AssignRole: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [processing, setProcessing] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    mode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: true,
  })

  const onSubmit = async ({ email, role }: Inputs) => {
    if (authState === null || authState.firebaseUser == null) {
      addToast({ title: "不明なエラーが発生しました", kind: "error" })
      return
    }

    if (email === authState.sosUser?.email) {
      addToast({
        title: "自分自身の権限を変更することはできません",
        kind: "error",
      })
      return
    }

    const idToken = await authState.firebaseUser.getIdToken()

    if (
      process.browser &&
      window.confirm("入力されたユーザーに権限を付与しますか?")
    ) {
      setProcessing(true)

      try {
        const res = await assignUserRoleToEmail({
          props: {
            email,
            role,
          },
          idToken,
        })

        if ("errorCode" in res) {
          setProcessing(false)

          switch (res.errorCode) {
            case "invalidEmailAddress":
              addToast({ title: "正しくないメールアドレスです", kind: "error" })
              reportError("failed to create new form", { error: res.error })
              break
            case "notUniversityEmailAddress":
              addToast({
                title: "tsukuba.ac.jpで終わるメールアドレスを入力してください",
                kind: "error",
              })
              reportError("failed to create new form", { error: res.error })
              break
            case "timeout":
              addToast({
                title: "権限の付与を完了できませんでした",
                descriptions: ["通信環境などをご確認ください"],
                kind: "error",
              })
              break
          }
          return
        }

        setProcessing(false)
        addToast({ title: "権限を付与しました", kind: "success" })
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
      <Head title="管理者権限付与" />
      <h1 className={styles.title}>管理者権限付与</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.sectionWrapper}>
          <Panel>
            <FormItemSpacer>
              <TextField
                type="text"
                label="権限を付与するユーザーのメールアドレス"
                placeholder="xxx@s.tsukuba.ac.jp"
                required
                error={[
                  errors.email?.types?.required && "必須項目です",
                  errors?.email?.types?.pattern &&
                    "使用できないメールアドレスです",
                ]}
                register={register("email", {
                  required: true,
                  pattern:
                    process.env.NEXT_PUBLIC_DEPLOY_ENV === "dev"
                      ? /^[\w\-._+]+@([\w\-._]+\.)?tsukuba\.ac\.jp$/
                      : /^[\w\-._]+@([\w\-._]+\.)?tsukuba\.ac\.jp$/,
                  setValueAs: (value) => value?.trim(),
                })}
              />
            </FormItemSpacer>
            <FormItemSpacer>
              <Dropdown
                label="付与する権限"
                options={[
                  {
                    value: "",
                    label: "選択してください",
                  },
                  {
                    value: "committee",
                    label: "実委人",
                  },
                  {
                    value: "committee_operator",
                    label: "実委人(管理者)",
                  },
                  {
                    value: "administrator",
                    label: "SOS管理者",
                  },
                ]}
                error={[errors.role?.types?.required && "必須項目です"]}
                required
                register={register("role", {
                  required: true,
                })}
              />
            </FormItemSpacer>
          </Panel>
        </div>
        <Button
          type="submit"
          icon="rocket"
          processing={processing}
          fullWidth={true}
        >
          権限を付与する
        </Button>
      </form>
    </div>
  )
}
AssignRole.layout = "committee"
AssignRole.rbpac = { type: "higherThanIncluding", role: "administrator" }

export default AssignRole
