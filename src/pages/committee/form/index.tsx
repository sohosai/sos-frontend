import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { saveAs } from "file-saver"
import type { PageFC } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

import { listForms } from "../../../lib/api/form/listForms"
import { exportFormAnswers } from "../../../lib/api/formAnswer/exportFormAnswers"
import { pagesPath } from "../../../utils/$path"
import { createCsvBlob } from "../../../utils/createCsvBlob"
import styles from "./index.module.scss"
import {
  Button,
  Dropdown,
  Head,
  IconButton,
  Panel,
  Spinner,
  Tooltip,
  TextField,
} from "src/components/"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import type { Form } from "src/types/models/form"
import { isUserRoleHigherThanIncluding } from "src/types/models/user/userRole"

dayjs.extend(utc)
dayjs.extend(timezone)

const ListForms: PageFC = () => {
  const router = useRouter()
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [backupForms, setBackupForms] = useState<Form[] | undefined | null>(
    null
  )
  const [forms, setForms] = useState<Form[] | undefined | null>(null)
  const [downloadingForms, setDownloadingForms] = useState<{
    [formId: string]: boolean
  }>({})
  const [isEligibleToCreateNewForm, setIsEligibleToCreateNewForm] =
    useState(false)

  type SortOrder = "asc" | "desc" | ""
  type SortTarget = "name" | "starts_at" | "ends_at"
  const [sortOrder, setSortOrder] = useState<SortOrder>("")
  const [sortTarget, setSortTarget] = useState<SortTarget>("name")

  const downloadFormAnswersCsv = async (form: Form) => {
    if (authState === null || authState.firebaseUser === null) return

    setDownloadingForms((prev) => ({ ...prev, [form.id]: true }))

    exportFormAnswers({
      props: {
        form_id: form.id,
      },
      idToken: await authState.firebaseUser.getIdToken(),
    })
      .then((res) => {
        setDownloadingForms((prev) => ({ ...prev, [form.id]: false }))
        saveAs(
          createCsvBlob(res),
          `${form.name}-answers-${dayjs().format("YYYY-M-D-HH-mm")}.csv`
        )
      })
      .catch((err) => {
        setDownloadingForms((prev) => ({ ...prev, [form.id]: false }))
        throw err
      })
  }

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      if (
        isUserRoleHigherThanIncluding({
          userRole: authState.sosUser.role,
          criteria: "committee_operator",
        })
      ) {
        setIsEligibleToCreateNewForm(true)
      }

      listForms({ idToken: await authState.firebaseUser.getIdToken() })
        .then(({ forms: fetchedForms }) => {
          setForms(fetchedForms)
          setBackupForms(fetchedForms)
        })
        .catch(async (err) => {
          const body = await err.response?.json()
          addToast({ title: "エラーが発生しました", kind: "error" })
          throw body ?? err
        })
    })()
  }, [authState])

  const sortForm = (sortTarget: SortTarget, sortOrder: SortOrder) => {
    if (forms && sortOrder !== "") {
      setForms(
        [...forms].sort((x: Form, y: Form) => {
          const result =
            x[sortTarget] > y[sortTarget]
              ? 1
              : x[sortTarget] < y[sortTarget]
              ? -1
              : 0
          if (sortOrder === "asc") return result
          else return -result
        })
      )
    }
  }

  const onChangeSortOrder = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value as SortOrder
    setSortOrder(order)
    sortForm(sortTarget, order)
  }

  const onChangeSortTarget = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target.value as SortTarget
    setSortTarget(target)
    sortForm(target, sortOrder)
  }

  const onChangeSearchField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    if (!backupForms) return
    if (text === "") {
      setForms(backupForms)
      return
    }
    const regexp = new RegExp(text)
    setForms(
      backupForms.filter((form) => {
        return form.name.match(regexp)
      })
    )
  }

  return (
    <div className={styles.wrapper}>
      <Head title="申請一覧" />
      <h1 className={styles.title}>申請一覧</h1>
      {isEligibleToCreateNewForm && (
        <div className={styles.newFormButton}>
          <Link href={pagesPath.committee.form.new.$url()}>
            <a>
              <Button icon="plus">申請を新規作成</Button>
            </a>
          </Link>
        </div>
      )}
      {backupForms?.length !== 0 && (
        <Panel
          style={{
            paddingTop: "16px",
            paddingBottom: "16px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex" }}>
            <div>
              <p className={styles.sortLabel}>ソート</p>
              <div style={{ display: "flex" }}>
                <Dropdown
                  options={[
                    {
                      label: "申請名",
                      value: "name",
                    },
                    {
                      label: "申請開始日時",
                      value: "starts_at",
                    },
                    {
                      label: "申請終了日時",
                      value: "ends_at",
                    },
                  ]}
                  style={{ width: "150px", margin: "0 10px" }}
                  onChange={onChangeSortTarget}
                />
                <Dropdown
                  options={[
                    {
                      label: "-",
                      value: "",
                    },
                    {
                      label: "昇順",
                      value: "asc",
                    },
                    {
                      label: "降順",
                      value: "desc",
                    },
                  ]}
                  style={{ width: "150px", margin: "0 10px" }}
                  onChange={onChangeSortOrder}
                />
              </div>
            </div>
            <div>
              <p className={styles.sortLabel}>検索</p>
              <TextField
                type="text"
                placeholder="絞り込む"
                onChange={onChangeSearchField}
                style={{ margin: "0 10px", width: "250px" }}
              />
            </div>
          </div>
        </Panel>
      )}
      {forms?.length ? (
        <>
          {forms.map((form) => (
            <div className={styles.formRowWrapper} key={form.id}>
              <Panel
                style={{
                  paddingTop: "16px",
                  paddingBottom: "16px",
                }}
              >
                <div className={styles.formRowInner}>
                  <p className={styles.formName}>{form.name}</p>
                  <p className={styles.formDate}>
                    {dayjs.tz(form.starts_at, "Asia/Tokyo").format("M/D HH:mm")}
                    <i
                      className={`jam-icons jam-arrow-right ${styles.formDateIcon}`}
                    />
                    {dayjs.tz(form.ends_at, "Asia/Tokyo").format("M/D HH:mm")}
                    <span className={styles.formDateState}>
                      {(() => {
                        if (
                          dayjs().isBefore(
                            dayjs.tz(form.starts_at, "Asia/Tokyo")
                          )
                        )
                          return "開始前"

                        if (
                          dayjs().isAfter(dayjs.tz(form.ends_at, "Asia/Tokyo"))
                        )
                          return "終了"

                        return "回答中"
                      })()}
                    </span>
                  </p>
                  <Tooltip title="申請を編集する">
                    <div>
                      <IconButton
                        icon="pencil"
                        onClick={() =>
                          router.push(
                            pagesPath.committee.form.edit.$url({
                              query: { id: form.id },
                            })
                          )
                        }
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="回答をCSVでダウンロード">
                    <div>
                      <IconButton
                        icon="download"
                        processing={downloadingForms[form.id]}
                        onClick={() => downloadFormAnswersCsv(form)}
                      />
                    </div>
                  </Tooltip>
                </div>
              </Panel>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.panelWrapper}>
          <Panel>
            <div className={styles.emptyWrapper}>
              {forms === null ? (
                <>
                  <Spinner />
                </>
              ) : backupForms?.length ? (
                <p>条件を満たす申請が見つかりませんでした</p>
              ) : (
                <p>申請が作成されていません</p>
              )}
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}
ListForms.layout = "committee"
ListForms.rbpac = { type: "higherThanIncluding", role: "committee" }

export default ListForms
