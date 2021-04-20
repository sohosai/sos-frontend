import { useState, useEffect } from "react"

import type { PageFC } from "next"

import { useAuth } from "../../../contexts/auth"

import { User } from "../../../types/models/user"
import { userRoleToUiText } from "../../../types/models/user/userRole"

import { listUsers } from "../../../lib/api/user/listUsers"
import { exportUsers } from "../../../lib/api/user/exportUsers"

import { saveAs } from "file-saver"

import { Button, Panel, Spinner } from "../../../components/"

import styles from "./list.module.scss"

const ListUsers: PageFC = () => {
  const { idToken } = useAuth()

  const [users, setUsers] = useState<User[] | null | undefined>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (idToken) {
      listUsers({ idToken })
        .then(({ users: fetchedUsers }) => {
          setUsers(fetchedUsers)
        })
        .catch(async (e) => {
          const body = await e.response.json()
          // TODO: err handling
          setError(true)
          throw body
        })
    }
  }, [idToken])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>ユーザー一覧</h1>
      <div className={styles.downloadButton}>
        <Button
          icon="download"
          onClick={() => {
            if (!idToken) return

            exportUsers({ idToken })
              .then((res) => {
                // TODO: datetime in filename
                saveAs(new Blob([res], { type: "text/csv" }), "sos-users.csv")
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
