import { useState, useEffect } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { PendingProject } from "../types/models/project"

import { getPendingProject } from "../lib/api/project/getPendingProject"

import { pagesPath } from "../utils/$path"

import { Button, Head, Panel, Spinner } from "../components"

import styles from "./accept-subowner.module.scss"

export type Query = {
  pendingProjectId: string
}

const AcceptSubowner: PageFC = () => {
  const [pendingProject, setPendingProject] = useState<PendingProject>()
  const [error, setError] = useState<
    "pendingProjectNotFound" | "hasOwnPendingProject" | "subownerAlreadyExists"
  >()

  const { authState } = useAuthNeue()
  const { acceptSubowner, myProjectState } = useMyProject()
  const { addToast } = useToastDispatcher()

  const router = useRouter()

  const onClick = async () => {
    const { pendingProjectId } = router.query as Query
    if (!pendingProjectId) {
      setError("pendingProjectNotFound")
      return
    }
    if (authState?.status !== "bothSignedIn") return

    acceptSubowner({
      pendingProjectId,
      idToken: await authState.firebaseUser.getIdToken(),
    })
      .catch(async (err) => {
        const body = err.response?.json()
        // FIXME:
        addToast({ title: "エラーが発生しました", kind: "error" })
        throw body ?? err
      })
      .then(() => {
        addToast({ title: "副責任者登録が完了しました", kind: "success" })

        router.push(pagesPath.project.$url())
      })
  }

  useEffect(() => {
    ;(async () => {
      if (myProjectState?.isPending === true) {
        setError("hasOwnPendingProject")
        return
      }

      if (myProjectState?.isPending === false) {
        setError("subownerAlreadyExists")
        return
      }

      const { pendingProjectId } = router.query as Query
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
        setError("hasOwnPendingProject")
      }

      setPendingProject(fetchedPendingProject)
    })()
  }, [authState, router, myProjectState?.isPending])

  return (
    <div className={styles.wrapper}>
      <Head title="副責任者登録" />
      <h1 className={styles.title}>副責任者登録</h1>
      <Panel>
        {pendingProject && !error ? (
          <>
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
          </>
        ) : (
          <>
            <div className={styles.emptyWrapper}>
              {(() => {
                if (error === "pendingProjectNotFound")
                  return <p>お探しの企画が見つかりませんでした</p>

                if (error === "subownerAlreadyExists")
                  return <p>あなたの企画では既に副責任者登録が完了しています</p>

                if (error === "hasOwnPendingProject") {
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
                }

                return <Spinner />
              })()}
            </div>
          </>
        )}
      </Panel>
    </div>
  )
}
AcceptSubowner.layout = "default"
AcceptSubowner.rbpac = { type: "higherThanIncluding", role: "general" }

export default AcceptSubowner
