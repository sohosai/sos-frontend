import { useState, useEffect } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { getFormAnswerSharedFile } from "src/lib/api/file/getFormAnswerSharedFile"
import { reportError } from "src/lib/errorTracking/reportError"

import { Head, Panel, Spinner } from "src/components"
import { FileLikeEntity, FileList } from "src/components/FileList"

import styles from "./form-answer.module.scss"

export type Query = {
  answerId: string
  /**
   * Comma separated
   */
  sharingIds: string
}

const FormAnswerSharedFile: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const router = useRouter()
  const { answerId, sharingIds } = router.query as Partial<Query>

  const [files, setFiles] = useState<FileLikeEntity[]>()
  const [error, setError] = useState<"noFiles" | "notFound" | "unknown">()

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      if (sharingIds === "") {
        setError("noFiles")
        return
      }

      if (!answerId || !sharingIds) {
        setError("notFound")
        return
      }

      const sharingIdsArray = sharingIds.split(",")

      try {
        const res = await Promise.all(
          sharingIdsArray.map(async (sharingId) =>
            getFormAnswerSharedFile({
              props: {
                answerId,
                sharingId: sharingId,
              },
              idToken: await authState.firebaseUser.getIdToken(),
            })
          )
        )
        setFiles(
          res.map((file) => {
            if ("errorCode" in file || !file.filename) {
              return { error: true }
            }
            return new File([file.blob], file.filename, {
              type: file.blob.type,
            })
          })
        )
      } catch (err) {
        setError("unknown")
        addToast({ title: "不明なエラーが発生しました", kind: "error" })
        reportError("failed to get shared file", {
          error: err,
        })
      }
    })()
  }, [authState, sharingIds])

  return (
    <div className={styles.wrapper}>
      <Head title="フォーム回答の提出ファイル" />
      <h1 className={styles.title}>提出されたファイル</h1>
      <Panel>
        {files && !error ? (
          <>
            {files.length ? (
              <FileList files={files}></FileList>
            ) : (
              <div className={styles.emptyWrapper}>
                <p>提出されたファイルはありません</p>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyWrapper}>
            {(() => {
              if (error === "noFiles") {
                return <p>提出されたファイルはありません</p>
              }

              if (error === "notFound") {
                return <p>お探しのファイルが見つかりませんでした</p>
              }

              if (error === "unknown") {
                return <p>不明なエラーが発生しました</p>
              }

              return <Spinner />
            })()}
          </div>
        )}
      </Panel>
    </div>
  )
}
FormAnswerSharedFile.layout = "committee"
FormAnswerSharedFile.rbpac = { type: "higherThanIncluding", role: "committee" }

export default FormAnswerSharedFile
