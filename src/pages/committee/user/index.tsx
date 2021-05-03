import { useState, useEffect } from "react"

import type { PageFC } from "next"

import { useAuthNeue } from "../../../contexts/auth"

import { User } from "../../../types/models/user"
import { userRoleToUiText } from "../../../types/models/user/userRole"

import { listUsers } from "../../../lib/api/user/listUsers"
import { exportUsers } from "../../../lib/api/user/exportUsers"

import { saveAs } from "file-saver"

import { createCsvBlob } from "../../../utils/createCsvBlob"

import { Button, Head, Panel, Spinner } from "../../../components"

import styles from "./index.module.scss"

const ListUsers: PageFC = () => {
  const { authState } = useAuthNeue()

  const [users, setUsers] = useState<User[] | null | undefined>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (authState === null || authState.firebaseUser == null) return

      const idToken = await authState.firebaseUser.getIdToken()

      if (idToken) {
        listUsers({ idToken })
          .then(({ users: fetchedUsers }) => {
            setUsers(fetchedUsers)
          })
          .catch(async (e) => {
            const body = await e.response?.json()
            // TODO: err handling
            setError(true)
            throw body
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
          onClick={async () => {
            if (authState === null || authState.firebaseUser == null) return

            const idToken = await authState.firebaseUser.getIdToken()

            exportUsers({ idToken })
              .then((res) => {
                // TODO: datetime in filename
                saveAs(createCsvBlob(res), "sos-users.csv")
              })
              .catch(async (err) => {
                const body = await err.response?.json()
                console.error(body ?? err)
              })
          }}
        >
          CSVでダウンロード
        </Button>
      </div>
      <Panel>
        {users === null ? (
          <div className={styles.emptyWrapper}>
            <Spinner />
          </div>
        ) : (
          <>
            {!error ? (
              <>
                {users?.length ? (
                  <div className={styles.usersTableWrapper}>
                    <table className={styles.table}>
                      <thead className={styles.head}>
                        <tr>
                          <th className={styles.headCell}>氏名</th>
                          <th className={styles.headCell}>権限</th>
                          <th className={styles.headCell}>所属</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(({ name, role, affiliation, id }) => {
                          return (
                            <tr key={id} className={styles.row}>
                              <td
                                className={styles.cell}
                              >{`${name.last} ${name.first}`}</td>
                              <td className={styles.cell}>
                                {userRoleToUiText(role)}
                              </td>
                              <td className={styles.cell}>{affiliation}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={styles.emptyWrapper}>
                    <p>ユーザーが見つかりませんでした</p>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.emptyWrapper}>
                <p className={styles.error}>エラーが発生しました</p>
              </div>
            )}
          </>
        )}
      </Panel>
    </div>
  )
}
ListUsers.layout = "committee"
ListUsers.rbpac = { type: "higherThanIncluding", role: "committee_operator" }

export default ListUsers
