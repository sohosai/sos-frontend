import dayjs from "dayjs"
import { saveAs } from "file-saver"
import type { PageFC } from "next"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button, Head, Panel, Spinner } from "../../../components"
import { exportUsers } from "../../../lib/api/user/exportUsers"
import { listUsers } from "../../../lib/api/user/listUsers"

import { reportError } from "../../../lib/errorTracking/reportError"
import { User, userTypeToUiText } from "../../../types/models/user"
import { userRoleToUiText } from "../../../types/models/user/userRole"

import { pagesPath } from "../../../utils/$path"
import { createCsvBlob } from "../../../utils/createCsvBlob"

import styles from "./index.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

const ListUsers: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [users, setUsers] = useState<User[] | null>(null)
  const [downloading, setDownloading] = useState(false)

  const downloadUsersCsv = async () => {
    if (authState === null || authState.firebaseUser == null) return

    setDownloading(true)

    exportUsers({ idToken: await authState.firebaseUser.getIdToken() })
      .then((res) => {
        setDownloading(false)

        saveAs(
          createCsvBlob(res),
          `sos-users-${dayjs().format("YYYY-M-D-HH-mm")}.csv`
        )
      })
      .catch(async (err) => {
        setDownloading(false)
        const body = await err.response?.json()
        reportError("failed to export users in CSV", { error: body ?? err })
      })
  }

  useEffect(() => {
    ;(async () => {
      if (authState === null || authState.firebaseUser == null) return

      const idToken = await authState.firebaseUser.getIdToken()

      if (idToken) {
        listUsers({ idToken })
          .then(({ users: fetchedUsers }) => {
            setUsers(
              fetchedUsers.sort((a, b) =>
                a.kana_name.last + a.kana_name.first >
                b.kana_name.last + b.kana_name.first
                  ? 1
                  : -1
              )
            )
          })
          .catch(async (e) => {
            const body = await e.response?.json()
            addToast({ title: "エラーが発生しました", kind: "error" })
            throw body ?? e
          })
      }
    })()
  }, [authState])

  return (
    <div className={styles.wrapper}>
      <Head title="ユーザー一覧" />
      <h1 className={styles.title}>ユーザー一覧</h1>
      <div className={styles.downloadButton}>
        <Button
          icon="download"
          processing={downloading}
          onClick={downloadUsersCsv}
        >
          CSVでダウンロード
        </Button>
      </div>
      <Panel>
        {users?.length ? (
          <div className={styles.usersTableWrapper}>
            <div className={styles.table}>
              <div className={styles.head}>
                <p className={styles.headCell}>氏名</p>
                <p className={styles.headCell}>権限</p>
                <p className={styles.headCell}>所属</p>
              </div>
              <ul>
                {users.map(({ name, role, type, id }) => {
                  return (
                    <li key={id} className={styles.rowWrapper}>
                      <Link
                        href={pagesPath.committee.user.details.$url({
                          query: { id },
                        })}
                      >
                        <a className={styles.row}>
                          <p
                            className={styles.cell}
                          >{`${name.last} ${name.first}`}</p>
                          <p className={styles.cell}>
                            {userRoleToUiText(role)}
                          </p>
                          <p className={styles.cell}>
                            {userTypeToUiText(type)}
                          </p>
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className={styles.emptyWrapper}>
            {users === null ? (
              <>
                <Spinner />
              </>
            ) : (
              <p>ユーザーが存在しません</p>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
ListUsers.layout = "committee"
ListUsers.rbpac = { type: "higherThanIncluding", role: "committee_operator" }

export default ListUsers
