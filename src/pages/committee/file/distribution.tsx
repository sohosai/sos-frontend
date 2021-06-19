import { useState, useEffect } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { DistributedFile, FileDistribution } from "src/types/models/files"

// import { getFileDistribution } from "src/lib/api/file/getFileDistribution"
import { getProjectSharedFile } from "src/lib/api/file/getProjectSharedFile"
import { getSharedFile } from "src/lib/api/file/getSharedFile"
import { reportError } from "src/lib/errorTracking/reportError"

import {
  FileList,
  Head,
  Panel,
  ParagraphWithUrlParsing,
  Spinner,
} from "src/components"

import styles from "./distribution.module.scss"

export type Query = {
  // distributionId: string
  sharingId: string
  targetProjectId: string
}

const Distribution: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [distribution, setDistribution] = useState<DistributedFile>()
  const [files, setFiles] = useState<File[]>()
  const [error, setError] = useState<"notFound" | "unknown">()
  const [filesError, setFilesError] = useState<"unableToLoadSomeFiles">()

  const router = useRouter()
  const { sharingId, targetProjectId } = router.query as Partial<Query>

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      // reset
      setError(undefined)

      if (!sharingId || !targetProjectId) {
        setError("notFound")
        return
      }

      try {
        const fetchedFile = await getProjectSharedFile({
          props: {
            sharingId,
            projectId: targetProjectId,
          },
          idToken: await authState.firebaseUser.getIdToken(),
        })
        if ("errorCode" in fetchedFile) {
          switch (fetchedFile.errorCode) {
            case "fileNotFound": {
              addToast({
                title: "お探しのファイルが見つかりませんでした",
                kind: "error",
              })
              setError("notFound")
              reportError(
                "failed to get file distribution for committee",
                fetchedFile.error
              )
              return
            }
          }
        }
        // setDistribution(fetchedDistribution)

        // FIXME:
        console.log(fetchedFile)

        // // 今のところ企画ごとに異なるファイルが配布されることはない
        // const fileSharingIds = Array.from(
        //   new Set(fetchedFile.files.map((f) => f.sharing_id))
        // )

        // const files = await Promise.all(
        //   fileSharingIds.map(async (id) =>
        //     getSharedFile({
        //       props: {
        //         sharingId: id,
        //       },
        //       idToken: await authState.firebaseUser.getIdToken(),
        //     })
        //   )
        // )
        // console.log(files)
      } catch (err) {
        addToast({ title: "エラーが発生しました", kind: "error" })
        reportError("failed to get file distribution for committee", err)
        setError("unknown")
      }
    })()
  }, [authState, sharingId])

  return (
    <div className={styles.wrapper}>
      <Head title={distribution ? distribution.name : "ファイル配布"} />
      {distribution && error === undefined ? (
        <div className={styles.sections}>
          <div className={styles.sectionWrapper}>
            <Panel>
              <h1 className={styles.name}>{distribution.name}</h1>
              {distribution.description.length !== 0 && (
                <div className={styles.description}>
                  <ParagraphWithUrlParsing
                    text={distribution.description}
                    normalTextClassName={styles.descriptionText}
                  />
                </div>
              )}
            </Panel>
          </div>
        </div>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            {(() => {
              if (error === "notFound") {
                return <p>お探しのファイルが見つかりませんでした</p>
              }

              if (error === "unknown") {
                return <p>不明なエラーが発生しました</p>
              }

              return <Spinner />
            })()}
          </div>
        </Panel>
      )}
    </div>
  )
}
Distribution.layout = "committee"
Distribution.rbpac = { type: "higherThanIncluding", role: "committee" }

export default Distribution
