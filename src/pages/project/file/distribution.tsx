import { PageFC } from "next"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

import styles from "./distribution.module.scss"
import {
  FileList,
  Head,
  Panel,
  ParagraphWithUrlParsing,
  Spinner,
} from "src/components"
import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { getProjectFileDistribution } from "src/lib/api/file/getProjectFileDistribution"
import { getProjectSharedFile } from "src/lib/api/file/getProjectSharedFile"
import { reportError } from "src/lib/errorTracking/reportError"
import { DistributedFile } from "src/types/models/files"

export type Query = {
  distributionId: string
}

const FileDistribution: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()
  const { addToast } = useToastDispatcher()

  const [distribution, setDistribution] = useState<DistributedFile>()
  const [files, setFiles] = useState<File[]>()
  const [error, setError] = useState<"idNotFound" | "notFound" | "unknown">()

  const router = useRouter()
  const { distributionId } = router.query as Partial<Query>

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return
      if (myProjectState?.isPending !== false) return

      if (!distributionId) {
        setError("idNotFound")
        return
      }

      try {
        const getDistributionRes = await getProjectFileDistribution({
          props: {
            projectId: myProjectState.myProject.id,
            distributionId,
          },
          idToken: await authState.firebaseUser.getIdToken(),
        })

        switch (getDistributionRes.errorCode) {
          case "notFound":
            addToast({
              title: "お探しのファイルが見つかりませんでした",
              kind: "error",
            })
            return
        }

        const { distributedFile } = getDistributionRes
        setDistribution(distributedFile)

        const getFileRes = await getProjectSharedFile({
          props: {
            projectId: myProjectState.myProject.id,
            sharingId: distributedFile.sharing_id,
          },
          idToken: await authState.firebaseUser.getIdToken(),
        })

        if ("errorCode" in getFileRes) {
          switch (getFileRes.errorCode) {
            case "fileNotFound":
              addToast({
                title: "お探しのファイルが見つかりませんでした",
                kind: "error",
              })
          }
          return
        }

        setFiles([
          new File(
            [getFileRes.blob],
            getFileRes.filename ?? distributedFile.name,
            { type: getFileRes.blob.type }
          ),
        ])
      } catch (err) {
        setError("unknown")
        addToast({ title: "エラーが発生しました", kind: "error" })
        reportError("failed to get file distribution for the project", err)
      }
    })()
  }, [authState, myProjectState, distributionId])

  return (
    <div className={styles.wrapper}>
      <Head title={distribution ? `${distribution.name}` : "ファイル配布"} />
      {distribution && error === undefined ? (
        <div className={styles.sections}>
          <div className={styles.sectionWrapper}>
            <Panel>
              <h1 className={styles.name}>{distribution.name}</h1>
              {distribution.description?.length !== 0 && (
                <div className={styles.description}>
                  <ParagraphWithUrlParsing
                    text={distribution.description}
                    normalTextClassName={styles.descriptionText}
                  />
                </div>
              )}
            </Panel>
          </div>
          <div className={styles.sectionWrapper}>
            <Panel>
              <h2 className={styles.sectionTitle}>ファイル</h2>
              {files ? <FileList files={files} /> : <Spinner />}
            </Panel>
          </div>
        </div>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            {(() => {
              if (error === "idNotFound" || error === "notFound") {
                return <p>お探しのファイルが見つかりませんでした</p>
              }
              if (error === "unknown") {
                return <p>エラーが発生しました</p>
              }

              return <Spinner />
            })()}
          </div>
        </Panel>
      )}
    </div>
  )
}
FileDistribution.layout = "default"
FileDistribution.rbpac = { type: "higherThanIncluding", role: "general" }

export default FileDistribution
