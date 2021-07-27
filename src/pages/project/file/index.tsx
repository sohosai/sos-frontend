import { PageFC } from "next"
import Link from "next/link"
import { useState, useEffect } from "react"

import styles from "./index.module.scss"
import { Head, Icon, Panel, Spinner } from "src/components"
import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { listProjectFileDistributions } from "src/lib/api/file/listProjectFileDistributions"
import { reportError } from "src/lib/errorTracking/reportError"
import { DistributedFile } from "src/types/models/files"

import { pagesPath } from "src/utils/$path"

const FileDistributionsForProject: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()
  const { addToast } = useToastDispatcher()

  const [distributions, setDistributions] = useState<DistributedFile[]>()
  const [generalError, setGeneralError] = useState<
    "noMyProject" | "projectPending" | "unknown"
  >()

  useEffect(() => {
    ;(async () => {
      // reset
      setGeneralError(undefined)

      if (authState?.status !== "bothSignedIn") return
      if (myProjectState === null) return

      if (myProjectState?.error) {
        setGeneralError("unknown")
        return
      }
      if (myProjectState?.isPending === true) {
        setGeneralError("projectPending")
        return
      }
      if (myProjectState?.isPending !== false) {
        setGeneralError("noMyProject")
        return
      }

      try {
        const fetchedDistributions = await listProjectFileDistributions({
          props: {
            projectId: myProjectState.myProject.id,
          },
          idToken: await authState.firebaseUser.getIdToken(),
        })
        setDistributions(fetchedDistributions)
      } catch (err) {
        const body = await err.response?.json()
        addToast({ title: "不明なエラーが発生しました", kind: "error" })
        reportError(
          "failed to list file distributions for the project",
          body ?? err
        )
      }
    })()
  }, [authState, myProjectState])

  return (
    <div className={styles.wrapper}>
      <Head title="ファイル配布" />
      <h1 className={styles.title}>ファイル配布</h1>
      {distributions && generalError === undefined ? (
        <>
          {distributions.length ? (
            <ul className={styles.list}>
              {distributions.map((distribution) => (
                <li
                  key={distribution.distribution_id}
                  className={styles.rowWrapper}
                >
                  <Link
                    href={pagesPath.project.file.distribution.$url({
                      query: { distributionId: distribution.distribution_id },
                    })}
                  >
                    <a>
                      <Panel
                        style={{
                          padding: "24px 32px",
                        }}
                        hoverStyle="gray"
                      >
                        <div className={styles.rowInner}>
                          <p className={styles.distributionName}>
                            {distribution.name}
                          </p>
                          <Icon
                            icon="arrow-right"
                            className={styles.rowArrowIcon}
                          />
                        </div>
                      </Panel>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Panel>
              <div className={styles.emptyWrapper}>
                <p>配布されているファイルはありません</p>
              </div>
            </Panel>
          )}
        </>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            {(() => {
              if (generalError === "noMyProject") {
                return <p>メンバーとなっている企画が存在しません</p>
              }
              if (generalError === "projectPending") {
                return (
                  <>
                    <p>企画が仮応募状態です</p>
                    <p>
                      配布ファイルにアクセスするためには応募を完了してください
                    </p>
                  </>
                )
              }
              if (generalError === "unknown") {
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
FileDistributionsForProject.layout = "default"
FileDistributionsForProject.rbpac = {
  type: "higherThanIncluding",
  role: "general",
}

export default FileDistributionsForProject
