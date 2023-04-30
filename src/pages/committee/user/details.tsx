import dayjs from "dayjs"
import { PageFC } from "next"
import { useRouter } from "next/router"
import { useState, useEffect, FC } from "react"
import { useForm } from "react-hook-form"

import styles from "./details.module.scss"
import {
  Button,
  Dropdown,
  FormItemSpacer,
  Head,
  IconButton,
  Panel,
  Spinner,
  Tooltip,
  Table,
} from "src/components"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { getUser } from "src/lib/api/user/getUser"
import { updateUser } from "src/lib/api/user/updateUser"
import { User, userCategoryToUiText } from "src/types/models/user"
import {
  isUserRoleHigherThanIncluding,
  UserRole,
  userRoleToUiText,
} from "src/types/models/user/userRole"
import { pagesPath } from "src/utils/$path"

export type Query = {
  id: string
}

type Inputs = {
  role: UserRole | ""
}

const UserDetails: PageFC = () => {
  const router = useRouter()
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [user, setUser] = useState<User>()
  const [error, setError] = useState<"notFound" | "unknown">()
  const [processing, setProcessing] = useState(false)
  const [isEligibleToChangeUserRole, setIsEligibleToChangeUserRole] =
    useState(false)
  const [roleOptions, setRoleOptions] = useState<
    { value: string; label: string }[]
  >([])

  const { register, handleSubmit } = useForm<Inputs>({
    mode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: true,
  })

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

  const defaultRoleOptions = [
    {
      value: "",
      label: "選択してください",
    },
    {
      value: "general",
      label: "一般",
    },
    {
      value: "committee",
      label: "実委人",
    },
    {
      value: "committee_operator",
      label: "実委人(管理者)",
    },
    {
      value: "administrator",
      label: "SOS管理者",
    },
  ]

  const onSubmit = async ({ role }: Inputs) => {
    if (
      authState === null ||
      authState.firebaseUser == null ||
      authState.sosUser == null ||
      user == null
    ) {
      addToast({ title: "不明なエラーが発生しました", kind: "error" })
      return
    }

    if (role === "") {
      addToast({ title: "権限を選択してください", kind: "error" })
      return
    }

    if (user.id === authState.sosUser.id) {
      addToast({
        title: "自分自身の権限を変更することはできません",
        kind: "error",
      })
      return
    }

    const idToken = await authState.firebaseUser.getIdToken()

    if (
      process.browser &&
      window.confirm("このユーザーの権限を変更しますか?")
    ) {
      setProcessing(true)

      try {
        const res = await updateUser({
          props: {
            id: user.id,
            role,
          },
          idToken,
        })

        if ("errorCode" in res) {
          setProcessing(false)

          switch (res.errorCode) {
            case "userNotFound":
              addToast({
                title: "ユーザーが見つかりませんでした",
                kind: "error",
              })
              break
            case "timeout":
              addToast({
                title: "権限の付与を完了できませんでした",
                descriptions: ["通信環境などをご確認ください"],
                kind: "error",
              })
              break
          }
          return
        }

        setProcessing(false)
        addToast({ title: "権限を変更しました", kind: "success" })

        router.push(pagesPath.committee.user.$url())
      } catch (err) {
        setProcessing(false)
        addToast({ title: "不明なエラーが発生しました", kind: "error" })
      }
    }
  }

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      if (
        isUserRoleHigherThanIncluding({
          userRole: authState.sosUser.role,
          criteria: "administrator",
        })
      ) {
        setIsEligibleToChangeUserRole(true)
      }

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
        setRoleOptions(
          defaultRoleOptions.filter((role) => role.value !== fetchedUser.role)
        )
      } catch (err) {
        // FIXME: any
        if ((err as any)?.error?.info?.type === "USER_NOT_FOUND") {
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
              <Table>
                <Table.Row
                  keyElement="所属"
                  valueElement={userCategoryToUiText(user.category)}
                />
                <Table.Row
                  keyElement="メールアドレス"
                  valueElement={
                    <>
                      <>
                        <p>{user.email}</p>
                        <CopyButton
                          string={user.email}
                          className={styles.tableRowValueCopyButton}
                        />
                      </>
                    </>
                  }
                  className={styles.tableRow}
                />
                <Table.Row
                  keyElement="電話番号"
                  valueElement={
                    <>
                      <p>{"0" + user.phone_number.slice(3)}</p>
                      <CopyButton
                        string={"0" + user.phone_number.slice(3)}
                        className={styles.tableRowValueCopyButton}
                      />
                    </>
                  }
                  className={styles.tableRow}
                />
                <Table.Row
                  keyElement="登録日時"
                  valueElement={dayjs(user.created_at).format("YYYY/M/D HH:mm")}
                />
              </Table>
            </Panel>
          </section>
          {isEligibleToChangeUserRole && (
            <section className={styles.section}>
              <Panel>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <FormItemSpacer>
                    <Dropdown
                      label="権限を変更する"
                      options={roleOptions}
                      required
                      register={register("role")}
                    />
                  </FormItemSpacer>
                  <FormItemSpacer>
                    <Button
                      type="submit"
                      icon="rocket"
                      processing={processing}
                      fullWidth={true}
                    >
                      権限を変更する
                    </Button>
                  </FormItemSpacer>
                </form>
              </Panel>
            </section>
          )}
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
