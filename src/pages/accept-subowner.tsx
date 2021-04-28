import { useState, useEffect } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useAuthNeue } from "../contexts/auth"
import { useMyProject } from "../contexts/myProject"

import { PendingProject } from "../types/models/project"

import { getPendingProject } from "../lib/api/project/getPendingProject"

import { pagesPath } from "../utils/$path"

import { Button, Panel, Spinner } from "../components"

import styles from "./accept-subowner.module.scss"

export type Query = {
  pendingProjectId: string
}

const AcceptSubowner: PageFC = () => {
  const [pendingProject, setPendingProject] = useState<PendingProject>()
  const [error, setError] = useState<
    | "pendingProjectNotFound"
    | "sameAsAuthor"
    | "subownerAlreadyExists"
    | "unknown"
  >()

  const { authState } = useAuthNeue()
  const { acceptSubowner, myProjectState } = useMyProject()

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
        setError("unknown")
        throw body ?? err
      })
      .then(() => {
        // TODO: toast に変更
        window.alert("副責任者登録が完了しました")

        // TODO: 企画トップページに変更
        router.push(pagesPath.mypage.$url())
      })
  }

  useEffect(() => {
    ;(async () => {
      if (myProjectState?.isPending === false) {
        setError("subownerAlreadyExists")
        return
      }

      const { pendingProjectId } = router.query as Query
      if (!pendingProjectId) {
        setError("pendingProjectNotFound")
        return
      }

      // rbpacRedirect されるのでまともに処理する必要なし
      if (authState?.status !== "bothSignedIn") return

      const {
        pending_project: fetchedPendingProject,
      } = await getPendingProject({
        pendingProjectId,
        idToken: await authState.firebaseUser.getIdToken(),
      }).catch(async (err) => {
        const body = await err.response?.json()
        // FIXME:
        setError("pendingProjectNotFound")
        throw body ?? err
      })

      if (fetchedPendingProject.author_id === authState.sosUser.id) {
        setError("sameAsAuthor")
      }

      setPendingProject(fetchedPendingProject)
    })()
  }, [authState, router, myProjectState?.isPending])

  return (
    <div className={styles.wrapper}>
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

                if (pendingProject && error === "sameAsAuthor") {
                  const link = `${process.env.NEXT_PUBLIC_FRONTEND_URL}accept-subowner?pendingProjectId=${pendingProject.id}`

                  return (
                    <>
                      <p className={styles.sameAsAuthor}>
                        責任者は副責任者を兼任できません
                      </p>
                      <p className={styles.sameAsAuthor}>
                        副責任者に以下のURLを送信してアクセスしていただき、副責任者の登録を完了してください
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

                if (error === "unknown")
                  return <p>不明なエラーが発生しました</p>

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
