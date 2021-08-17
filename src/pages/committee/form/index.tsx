import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { saveAs } from "file-saver"
import type { PageFC } from "next"
import Link from "next/link"
import { useState, useEffect } from "react"

import { listForms } from "../../../lib/api/form/listForms"
import { exportFormAnswers } from "../../../lib/api/formAnswer/exportFormAnswers"
import { pagesPath } from "../../../utils/$path"
import { createCsvBlob } from "../../../utils/createCsvBlob"
import styles from "./index.module.scss"
import {
  Button,
  Head,
  IconButton,
  Panel,
  Spinner,
  Tooltip,
} from "src/components/"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import type { Form } from "src/types/models/form"
import { isUserRoleHigherThanIncluding } from "src/types/models/user/userRole"

dayjs.extend(utc)
dayjs.extend(timezone)

const ListForms: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [forms, setForms] = useState<Form[] | undefined | null>(null)
  const [downloadingForms, setDownloadingForms] = useState<{
    [formId: string]: boolean
  }>({})
  const [isEligibleToCreateNewForm, setIsEligibleToCreateNewForm] =
    useState(false)

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
        })
        .catch(async (err) => {
          const body = await err.response?.json()
          addToast({ title: "エラーが発生しました", kind: "error" })
          throw body ?? err
        })
    })()
  }, [authState])

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
