import { PageFC } from "next"
import { useRouter } from "next/router"

import { useForm } from "react-hook-form"

import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { createFile } from "src/lib/api/file/createFile"
import { createFileDistribution } from "src/lib/api/file/createFileDistribution"
import { reportError } from "src/lib/errorTracking/reportError"

import { pagesPath } from "src/utils/$path"

import {
  Button,
  Dropzone,
  FileList,
  FormItemSpacer,
  Panel,
  Textarea,
  TextField,
} from "src/components"

import styles from "./new.module.scss"

type Inputs = {
  name: string
  description: string
  projectCodes: string
  // 複数ファイル対応を考えて
  file: FileList
}

const CommitteeFileUpload: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()
  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    trigger,
    watch,
  } = useForm<Inputs>({
    reValidateMode: "onBlur",
    criteriaMode: "all",
  })

  const onSubmit = async ({
    name,
    description,
    projectCodes,
    file,
  }: Inputs) => {
    if (authState?.status !== "bothSignedIn") return

    const projectCodeArray = Array.from(
      new Set(projectCodes.split(/[,\n]/).filter((str) => str))
    )

    const formData = new FormData()
    Array.from(file).map((f) => {
      formData.append("file", f, encodeURIComponent(f.name))
    })

    if (process.browser && window.confirm("ファイルを送信しますか?")) {
      try {
        const createdFiles = await createFile({
          props: { body: formData },
          idToken: await authState.firebaseUser.getIdToken(),
        })

        if (createdFiles.error === "outOfFileUsageQuota") {
          addToast({
            title: "ファイルアップロードの容量上限に達しています",
            kind: "error",
          })
          return
        }

        const createdFileDistribution = await createFileDistribution({
          props: {
            name,
            description,
            files: projectCodeArray.flatMap((projectCode) =>
              createdFiles.files.map(({ file: { id } }) => ({
                projectCode,
                fileId: id,
              }))
            ),
          },
          idToken: await authState.firebaseUser.getIdToken(),
        })

        switch (createdFileDistribution.errorCode) {
          case "duplicatedProject":
            addToast({ title: "重複する企画番号があります", kind: "error" })
            return
          case "fileNotFound":
            addToast({
              title: "ファイルをアップロードできませんでした",
              kind: "error",
            })

            // just in case
            reportError(
              "failed to create file distribution",
              createdFileDistribution.error
            )
            return
          case "fileSharingNotFound":
            addToast({
              title: "ファイルをアップロードできませんでした",
              kind: "error",
            })

            // just in case
            reportError(
              "failed to create file distribution",
              createdFileDistribution.error
            )
            return
          case "invalidProjectCode":
            addToast({ title: "無効な企画番号があります", kind: "error" })
            return
          case "projectNotFound":
            addToast({
              title: "当てはまる企画が見つかりませんでした",
              kind: "error",
            })
            return
          default: {
            addToast({ title: "ファイルを配布しました", kind: "success" })
            router.push(pagesPath.committee.file.$url())
          }
        }
      } catch (err) {
        const body = await err.response?.json()
        addToast({ title: "不明なエラーが発生しました", kind: "error" })
        reportError("failed to create file / file distribution", body ?? err)
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>ファイル配布</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.sectionWrapper}>
          <Panel>
            <FormItemSpacer>
              <TextField
                type="text"
                label="タイトル"
                placeholder="第2回ミーティング資料"
                required
                error={[
                  errors.name?.types?.required && "必須項目です",
                  errors.name?.types?.maxLength && "64字以内で入力してください",
                ]}
                register={register("name", {
                  required: true,
                  maxLength: 64,
                  setValueAs: (value) => value?.trim(),
                })}
              ></TextField>
            </FormItemSpacer>
            <FormItemSpacer>
              <Textarea
                label="説明"
                description={[
                  "URLはリンクとして認識されます(URLのある行にはURL以外を記述しないでください)",
                ]}
                error={[
                  errors.description?.types?.maxLength &&
                    "1024字以内で入力してください",
                ]}
                register={register("description", {
                  maxLength: 1024,
                  setValueAs: (value) => value?.trim(),
                })}
              ></Textarea>
            </FormItemSpacer>
          </Panel>
        </div>
        <div className={styles.sectionWrapper}>
          <Panel>
            <div className={styles.dropzoneWrapper}>
              <Dropzone
                label="ファイルをアップロード"
                errors={[
                  errors.file?.types?.required &&
                    "配布するファイルをアップロードしてください",
                ]}
                descriptions={[
                  "現在単一ファイルのみ対応しています",
                  "複数ファイルを配布したい場合はzip化などで対処をお願いします",
                ]}
                control={control}
                name="file"
                rules={{
                  required: true,
                }}
                triggerValidation={() => trigger("file")}
              />
            </div>
            <div className={styles.fileListWrapper}>
              <FileList files={Array.from(watch("file") ?? [])} />
            </div>
          </Panel>
        </div>
        <div className={styles.sectionWrapper}>
          <Panel>
            <FormItemSpacer>
              <Textarea
                label="対象企画"
                description={[
                  "企画番号を改行またはコンマ区切りで入力してください",
                ]}
                placeholder={"GI032\nCI038\nGO056\nGI071"}
                rows={6}
                required
                error={[errors.projectCodes?.types?.required && "必須項目です"]}
                register={register("projectCodes", {
                  required: true,
                  setValueAs: (value) => value?.trim(),
                })}
              />
            </FormItemSpacer>
          </Panel>
        </div>
        <div className={styles.submitButtonWrapper}>
          <Button type="submit" fullWidth icon="paper-plane">
            ファイルを配布する
          </Button>
        </div>
      </form>
    </div>
  )
}
CommitteeFileUpload.layout = "committee"
CommitteeFileUpload.rbpac = { type: "higherThanIncluding", role: "committee" }

export default CommitteeFileUpload
