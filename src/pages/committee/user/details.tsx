import dayjs from "dayjs"
import { PageFC } from "next"
import { useRouter } from "next/router"
import { useState, useEffect, FC, ReactElement } from "react"

import styles from "./details.module.scss"
import { Head, IconButton, Panel, Spinner, Tooltip } from "src/components"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { getUser } from "src/lib/api/user/getUser"
import { User, userCategoryTypeToUiText } from "src/types/models/user"
import { userRoleToUiText } from "src/types/models/user/userRole"

export type Query = {
  id: string
}

const TableRow: FC<{ keyString: string }> = ({ keyString, children }) => (
  <div className={styles.tableRow}>
    <div className={styles.tableRowKey}>
      <p>{keyString}</p>
    </div>
    <div className={styles.tableRowValue}>{children}</div>
  </div>
)

const UserDetails: PageFC = () => {
  const router = useRouter()
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [user, setUser] = useState<User>()
  const [error, setError] = useState<"notFound" | "unknown">()

  const { id: userId } = router.query as Partial<Query>

  const CopyButton: FC<{ string: string; className?: string }> = ({
    string,
    className = "",
  }) => (
    <div className={`${styles.copyButton} ${className}`}>
      <Tooltip title="クリップボードにコピー">
        <div>
          <IconButton
            size="small"
            icon="clipboard"
            onClick={async () => {
              await navigator.clipboard.writeText(string)
              addToast({
                title: "クリップボードにコピーしました",
                kind: "success",
              })
            }}
          />
        </div>
      </Tooltip>
    </div>
  )

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      setError(undefined)
      if (!userId || typeof userId !== "string") {
        setError("notFound")
        return
      }

      try {
        const { user: fetchedUser } = await getUser({
          userId,
          idToken: await authState.firebaseUser.getIdToken(),
        })
        setUser(fetchedUser)
      } catch (err) {
        if (err?.error?.info?.type === "USER_NOT_FOUND") {
          setError("notFound")
          addToast({ title: "ユーザーが見つかりませんでした", kind: "error" })
          return
        }

        setError("unknown")
        addToast({ title: "エラーが発生しました", kind: "error" })
        throw err
      }
    })()
  }, [authState, userId])

  return (
    <div className={styles.wrapper}>
      <Head title="ユーザー情報" />
      <h1 className={styles.title}>ユーザー情報</h1>
      {user && error === undefined ? (
        <div className={styles.sectionWrapper}>
          <section className={styles.section}>
            <Panel>
              <div className={styles.userName}>
                <p>{`${user.name.last} ${user.name.first}`}</p>
                <CopyButton
                  string={`${user.name.last} ${user.name.first}`}
                  className={styles.userNameCopyButton}
                />
              </div>
              <div className={styles.userKanaName}>
                <p>{`${user.kana_name.last} ${user.kana_name.first}`}</p>
                <CopyButton
                  string={`${user.kana_name.last} ${user.kana_name.first}`}
                  className={styles.userNameCopyButton}
                />
              </div>
              <p className={styles.userRole}>{userRoleToUiText(user.role)}</p>
            </Panel>
          </section>
          <section className={styles.section}>
            <Panel>
              <div className={styles.table}>
                {(() => {
                  const tableContents: Array<{
                    key: string
                    value: ReactElement
                  }> = [
                    {
                      key: "所属",
                      value: (
                        <p>
                          {user.category.type === "undergraduate_student"
                            ? `学群生 / ${user.category.affiliation}`
                            : `${userCategoryTypeToUiText(user.category.type)}`}
                        </p>
                      ),
                    },
                    {
                      key: "メールアドレス",
                      value: (
                        <>
                          {user.email.endsWith("@u.tsukuba.ac.jp") ? (
                            <div>
                              <div className={styles.transformedAddressWrapper}>
                                <p>
                                  {user.email.replace(
                                    "@u.tsukuba.ac.jp",
                                    "@s.tsukuba.ac.jp"
                                  )}
                                </p>
                                <CopyButton
                                  string={user.email.replace(
                                    "@u.tsukuba.ac.jp",
                                    "@s.tsukuba.ac.jp"
                                  )}
                                  className={styles.tableRowValueCopyButton}
                                />
                              </div>
                              <p
                                className={styles.transformedAddressDescription}
                              >
                                uアドレスで登録されているため、sアドレスに変換して表示しています
                              </p>
                            </div>
                          ) : (
                            <>
                              <p>{user.email}</p>
                              <CopyButton
                                string={user.email}
                                className={styles.tableRowValueCopyButton}
                              />
                            </>
                          )}
                        </>
                      ),
                    },
                    {
                      key: "電話番号",
                      value: (
                        <>
                          <p>{"0" + user.phone_number.slice(3)}</p>
                          <CopyButton
                            string={"0" + user.phone_number.slice(3)}
                            className={styles.tableRowValueCopyButton}
                          />
                        </>
                      ),
                    },
                    {
                      key: "登録日時",
                      value: (
                        <p>{dayjs(user.created_at).format("YYYY/M/D HH:mm")}</p>
                      ),
                    },
                  ]

                  return (
                    <>
                      {tableContents.map(({ key, value }) => (
                        <TableRow keyString={key} key={key}>
                          {value}
                        </TableRow>
                      ))}
                    </>
                  )
                })()}
              </div>
            </Panel>
          </section>
        </div>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            <>
              {(() => {
                if (error === "notFound") {
                  return <p>ユーザーが見つかりませんでした</p>
                }

                if (error === "unknown") {
                  return <p>エラーが発生しました</p>
                }

                return <Spinner />
              })()}
            </>
          </div>
        </Panel>
      )}
    </div>
  )
}
UserDetails.layout = "committee"
UserDetails.rbpac = { type: "higherThanIncluding", role: "committee_operator" }

export default UserDetails
