import { useState, useEffect } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { getSharedFile } from "src/lib/api/file/getSharedFile"
import { reportError } from "src/lib/errorTracking/reportError"

import styles from "./file.module.scss"

export type Query = {
  /**
   * Comma separated
   */
  sharingIds: string
}

const SharedFile: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const router = useRouter()
  const { sharingIds } = router.query as Partial<Query>

  const [error, setError] = useState<"notFound" | "unknown">()

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      if (!sharingIds) {
        setError("notFound")
        return
      }

      const sharingIdsArray = sharingIds.split(",")

      try {
        const res = await Promise.all(
          sharingIdsArray.map(async (sharingId) =>
            getSharedFile({
              props: {
                sharingId: sharingId,
              },
              idToken: await authState.firebaseUser.getIdToken(),
            })
          )
        )
        console.log(res)
      } catch (err) {
        setError("unknown")
        addToast({ title: "不明なエラーが発生しました", kind: "error" })
        reportError("failed to get shared file", {
          error: err,
        })
      }
    })()
  }, [authState, sharingIds])

  return <div className={styles.wrapper}></div>
}
SharedFile.layout = "default"
SharedFile.rbpac = { type: "higherThanIncluding", role: "general" }

export default SharedFile
