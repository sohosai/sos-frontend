import { useState, useEffect } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { PendingProject } from "../types/models/project"

import { getPendingProject } from "../lib/api/project/getPendingProject"
import { reportError } from "../lib/errorTracking/reportError"

import { pagesPath } from "../utils/$path"

import { Button, Head, Panel, Spinner } from "../components"

import styles from "./accept-subowner.module.scss"

export type Query = {
  pendingProjectId: string
}

const AcceptSubowner: PageFC = () => {
  const [pendingProject, setPendingProject] = useState<PendingProject>()
  const [isPendingProjectOwner, setIsPendingProjectOwner] = useState<boolean>()
  const [error, setError] = useState<"pendingProjectNotFound">()

  const { authState } = useAuthNeue()
  const { acceptSubowner, myProjectState } = useMyProject()
  const { addToast } = useToastDispatcher()

  const router = useRouter()

  const onClick = async () => {
    const { pendingProjectId } = router.query as Partial<Query>
    if (!pendingProjectId) {
      setError("pendingProjectNotFound")
      return
    }
    if (authState?.status !== "bothSignedIn") return

    try {
      const res = await acceptSubowner({
        pendingProjectId,
        idToken: await authState.firebaseUser.getIdToken(),
      })

      if ("errorCode" in res) {
        switch (res.errorCode) {
          case "pendingProjectNotFound": {
            addToast({
              title: "お探しの企画が見つかりませんでした",
              kind: "error",
            })
            return
          }
          case "outOfProjectCreationPeriod": {
            addToast({
              title: "企画応募期間外です",
              descriptions: ["現在副責任者になることはできません"],
              kind: "error",
            })
            return
          }
          case "alreadyProjectOwner": {
            addToast({
              title: "既に企画の責任者となっています",
              descriptions: ["他の企画の副責任者になることはできません"],
              kind: "error",
            })
            return
          }
          case "alreadyProjectSubOwner": {
            addToast({
              title: "既に企画の副責任者となっています",
              descriptions: ["他の企画の副責任者になることはできません"],
              kind: "error",
            })
            return
          }
          case "alreadyPendingProjectOwner": {
            addToast({
              title: "既にご自身の企画を仮応募されています",
              descriptions: ["他の企画の副責任者になることはできません"],
              kind: "error",
            })
            return
          }
          default: {
            addToast({ title: "エラーが発生しました", kind: "error" })
            return
          }
        }
      }

      addToast({ title: "副責任者登録が完了しました", kind: "success" })
      router.push(pagesPath.project.$url())
    } catch (err) {
      const body = await err.response?.json()
      addToast({ title: "エラーが発生しました", kind: "error" })
      reportError(
        "failed to create new project with unknown error",
        body ?? err
      )
    }
  }

  useEffect(() => {
    ;(async () => {
      if (myProjectState?.isPending === true) {
        setIsPendingProjectOwner(true)
        return
      }

      const { pendingProjectId } = router.query as Partial<Query>
      if (!pendingProjectId) {
        setError("pendingProjectNotFound")
        return
      }

      if (authState?.status !== "bothSignedIn") return

      const { pendingProject: fetchedPendingProject } = await getPendingProject(
        {
          pendingProjectId,
          idToken: await authState.firebaseUser.getIdToken(),
        }
      ).catch(async (err) => {
        addToast({ title: "エラーが発生しました", kind: "error" })
        throw err
      })

      if (fetchedPendingProject === null) {
        setError("pendingProjectNotFound")
        return
      }

      if (fetchedPendingProject.owner_id === authState.sosUser.id) {
        setIsPendingProjectOwner(true)
      }

      setPendingProject(fetchedPendingProject)
    })()
  }, [authState, router, myProjectState?.isPending])

  return (
    <div className={styles.wrapper}>
      <Head title="副責任者登録" />
      <h1 className={styles.title}>副責任者登録</h1>
      {isPendingProjectOwner ? (
        <Panel style={{ padding: "48px" }}>
          {(() => {
            const link = `${process.env.NEXT_PUBLIC_FRONTEND_URL}accept-subowner?pendingProjectId=${myProjectState?.myProject?.id}`
            return (
              <>
                <p className={styles.sameAsAuthor}>
                  企画応募を完了するためには副責任者を登録する必要があります
                </p>
                <p className={styles.sameAsAuthor}>
                  副責任者に以下のURLを送信してアクセスしていただき、副責任者を登録してください
                </p>
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.linkForSubowner}
                >
                  {link}
                </a>
              </>
            )
          })()}
        </Panel>
      ) : (
        <>
          {pendingProject && !error ? (
            <Panel>
              <h2 className={styles.subTitle}>
                以下の企画の副責任者になることを承認しますか?
              </h2>
              <div className={styles.projectDetails}>
                <p className={styles.projectName}>{pendingProject.name}</p>
                {pendingProject.description.split("\n").map((text, index) => (
                  <p className={styles.projectDescription} key={index}>
                    {text}
                  </p>
                ))}
              </div>
              <Button icon="check" onClick={onClick}>
                承認する
              </Button>
            </Panel>
          ) : (
            <Panel>
              <div className={styles.emptyWrapper}>
                {(() => {
                  if (error === "pendingProjectNotFound")
                    return <p>お探しの企画が見つかりませんでした</p>

                  return <Spinner />
                })()}
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  )
}
AcceptSubowner.layout = "default"
AcceptSubowner.rbpac = { type: "higherThanIncluding", role: "general" }

export default AcceptSubowner
