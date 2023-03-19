import { PageFC } from "next"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

import { useForm } from "react-hook-form"
import {
  Button,
  Checkbox,
  FormItemSpacer,
  Head,
  Panel,
  Textarea,
  TextField,
} from "../../components"
import { IN_PROJECT_CREATION_PERIOD } from "../../lib/api/getProjectCreationAvailability"
import { pagesPath } from "../../utils/$path"

import styles from "./edit.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { reportError } from "src/lib/errorTracking"

import { awesomeCharacterCount } from "src/utils/awesomeCharacterCount"
import { isKana, katakanaToHiragana } from "src/utils/jpKana"

type PromiseType<T extends Promise<any>> = T extends Promise<infer P>
  ? P
  : never

type Inputs = {
  name: string
  kanaName: string
  groupName: string
  kanaGroupName: string
  description: string
}

const EditProjectInfo: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState, updateProjectInfo } = useMyProject()
  const { addToast } = useToastDispatcher()

  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<
    "noMyProject" | "outOfProjectCreationPeriod"
  >()

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<Inputs>({
    criteriaMode: "all",
    mode: "onBlur",
  })

  const onSubmit = async ({
    name,
    kanaName,
    groupName,
    kanaGroupName,
    description,
  }: Inputs) => {
    if (authState?.status !== "bothSignedIn") return
    if (myProjectState === null || myProjectState.myProject === null) return

    if (
      window.confirm(
        [
          "企画基本情報を編集すると企画登録の完了日時が現在の日時に更新され、先着順で企画数を制限する教室貸出などで不利になる可能性があります",
          "送信してよろしいですか?",
        ].join("\n")
      )
    ) {
      try {
        setSubmitting(true)

        const projectInfoBody = {
          name,
          kanaName: katakanaToHiragana(kanaName),
          groupName,
          kanaGroupName: katakanaToHiragana(kanaGroupName),
          description,
        }

        const handleResponse = (
          res: PromiseType<ReturnType<typeof updateProjectInfo>>
        ) => {
          setSubmitting(false)

          if ("errorCode" in res) {
            switch (res.errorCode) {
              case "outOfProjectCreationPeriod": {
                addToast({
                  title: "企画応募期間外です",
                  descriptions: [
                    "企画応募期間外にはご自身で自由に企画基本情報を編集いただくことができません",
                    "メールでお問い合わせください",
                  ],
                  kind: "error",
                })
                return
              }
              case "projectNotFound": {
                addToast({ title: "企画が見つかりませんでした", kind: "error" })
                reportError("failed to update project info", {
                  error: res,
                  requestBody: {
                    id: myProjectState.myProject.id,
                    ...projectInfoBody,
                  },
                })
                return
              }
              case "pendingProjectNotFound": {
                addToast({ title: "企画が見つかりませんでした", kind: "error" })
                reportError("failed to update project info", {
                  error: res,
                  requestBody: {
                    id: myProjectState.myProject.id,
                    ...projectInfoBody,
                  },
                })
                return
              }
              case "timeout": {
                addToast({ title: "通信に失敗しました", kind: "error" })
                return
              }
              case "unknown": {
                addToast({ title: "不明なエラーが発生しました", kind: "error" })
                reportError("failed to update project info", {
                  error: res,
                  requestBody: {
                    id: myProjectState.myProject.id,
                    ...projectInfoBody,
                  },
                })
                return
              }
            }
          }

          addToast({
            title: "企画基本情報の編集が完了しました",
            kind: "success",
          })
          router.push(pagesPath.project.$url())
        }

        if (myProjectState.isPending === false) {
          const res = await updateProjectInfo({
            projectId: myProjectState.myProject.id,
            idToken: await authState.firebaseUser.getIdToken(),
            body: projectInfoBody,
          })
          handleResponse(res)
        } else {
          const res = await updateProjectInfo({
            pendingProjectId: myProjectState.myProject.id,
            idToken: await authState.firebaseUser.getIdToken(),
            body: projectInfoBody,
          })
          handleResponse(res)
        }
      } catch (err) {
        setSubmitting(false)
        addToast({ title: "不明なエラーが発生しました", kind: "error" })
        reportError("failed to update project info", {
          error: err,
          requestBody: {
            id: myProjectState.myProject.id,
            name,
            kanaName,
            groupName,
            kanaGroupName,
            description,
          },
        })
      }
    }
  }

  useEffect(() => {
    ;(async () => {
      setError(undefined)
      if (authState?.status !== "bothSignedIn") return
      if (myProjectState === null || myProjectState.myProject === null) {
        setError("noMyProject")
        return
      }
      if (!(await IN_PROJECT_CREATION_PERIOD)) {
        setError("outOfProjectCreationPeriod")
        return
      }

      setValue("name", myProjectState.myProject.name)
      setValue("kanaName", myProjectState.myProject.kana_name)
      setValue("groupName", myProjectState.myProject.group_name)
      setValue("kanaGroupName", myProjectState.myProject.kana_group_name)
      setValue("description", myProjectState.myProject.description)
    })()
  }, [authState, myProjectState, setValue])

  return (
    <div className={styles.wrapper}>
      <Head title="企画基本情報の編集" />
      <h1 className={styles.title}>企画基本情報の編集</h1>
      <div className={styles.panelWrapper}>
        <Panel>
          {error ? (
            <div className={styles.emptyWrapper}>
              {(() => {
                if (error === "outOfProjectCreationPeriod")
                  return (
                    <>
                      <p>
                        企画応募期間外にはご自身で自由に企画基本情報を編集いただくことができません
                      </p>
                      <p>メールでお問い合わせください</p>
                    </>
                  )
                if (error === "noMyProject")
                  return <p>企画が見つかりませんでした</p>
              })()}
            </div>
          ) : (
            <form
              className={styles.form}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <fieldset>
                <FormItemSpacer>
                  <TextField
                    type="text"
                    label="企画名"
                    description={[
                      "22字以内で入力してください",
                      "半角・全角英数字及び半角記号は3文字でかな2文字としてカウントします",
                    ]}
                    error={[
                      errors.name?.types?.required && "必須項目です",
                      errors.name?.types?.awesomeMaxLength &&
                        "字数が多すぎます",
                    ]}
                    required
                    register={register("name", {
                      required: true,
                      validate: {
                        awesomeMaxLength: (value) =>
                          awesomeCharacterCount(value) <= 22,
                      },
                      setValueAs: (value) => value?.trim(),
                    })}
                  />
                </FormItemSpacer>
                <FormItemSpacer>
                  <TextField
                    type="text"
                    label="企画名(ふりがな)"
                    error={[
                      errors.kanaName?.types?.required && "必須項目です",
                      errors.kanaName?.types?.maxLength &&
                        "128字以内で入力してください",
                      errors.kanaName?.types?.isKana &&
                        "ひらがなで入力してください",
                    ]}
                    required
                    register={register("kanaName", {
                      required: true,
                      maxLength: 128,
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
                    label="企画団体名"
                    description={[
                      "25字以内で入力してください",
                      "半角・全角英数字及び半角記号は3文字でかな2文字としてカウントします",
                    ]}
                    error={[
                      errors.groupName?.types?.required && "必須項目です",
                      errors.groupName?.types?.awesomeMaxLength &&
                        "字数が多すぎます",
                    ]}
                    required
                    register={register("groupName", {
                      required: true,
                      validate: {
                        awesomeMaxLength: (value) =>
                          awesomeCharacterCount(value) <= 25,
                      },
                      setValueAs: (value) => value?.trim(),
                    })}
                  />
                </FormItemSpacer>
                <FormItemSpacer>
                  <TextField
                    type="text"
                    label="企画団体名(ふりがな)"
                    error={[
                      errors.kanaGroupName?.types?.required && "必須項目です",
                      errors.kanaGroupName?.types?.maxLength &&
                        "128字以内で入力してください",
                      errors.kanaGroupName?.types?.isKana &&
                        "ひらがなで入力してください",
                    ]}
                    required
                    register={register("kanaGroupName", {
                      required: true,
                      maxLength: 128,
                      validate: {
                        isKana: (value) => isKana(value),
                      },
                      setValueAs: (value) => value?.trim(),
                    })}
                  />
                </FormItemSpacer>
                <FormItemSpacer>
                  <Textarea
                    label="企画概要"
                    rows={3}
                    description={["50字以内で入力してください"]}
                    error={[
                      errors.description?.types?.required && "必須項目です",
                      errors.description?.types?.maxLength &&
                        "50字以内で入力してください",
                    ]}
                    required
                    register={register("description", {
                      required: true,
                      maxLength: 50,
                      setValueAs: (value) => value?.trim(),
                    })}
                  />
                </FormItemSpacer>
                <FormItemSpacer>
                  <span className={styles.descriptionsWrapper}>
                    ※企画登録後の参加区分・企画属性の変更はできません
                  </span>
                </FormItemSpacer>
              </fieldset>
              <div className={styles.submitButtonWrapper}>
                <Button
                  type="submit"
                  processing={submitting}
                  icon="paper-plane"
                  fullWidth
                >
                  企画基本情報を編集する
                </Button>
              </div>
            </form>
          )}
        </Panel>
      </div>
    </div>
  )
}
EditProjectInfo.layout = "default"
EditProjectInfo.rbpac = { type: "higherThanIncluding", role: "general" }

export default EditProjectInfo
