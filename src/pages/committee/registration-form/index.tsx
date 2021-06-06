import { useState, useEffect } from "react"

import { PageFC } from "next"

import type { RegistrationForm } from "src/types/models/registrationForm"

import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { listRegistrationForms } from "src/lib/api/registrationForm/listRegistrationForms"
import { exportRegistrationFormAnswers as exportRegistrationFormAnswersApi } from "src/lib/api/registrationForm/exportRegistrationFormAnswers"
import { reportError } from "src/lib/errorTracking/reportError"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

import { saveAs } from "file-saver"

import { createCsvBlob } from "src/utils/createCsvBlob"

import { IconButton, Panel, Spinner, Tooltip } from "src/components"

import styles from "./index.module.scss"

const RegistrationForms: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [registrationForms, setRegistrationForms] =
    useState<RegistrationForm[]>()
  const [error, setError] = useState<"unknown">()
  const [exportingRegistrationForms, setExportingRegistrationForms] = useState<{
    [registrationFormId: string]: boolean
  }>({})

  const exportAnswers = async ({
    registrationFormId,
    formName,
  }: {
    registrationFormId: string
    formName: string
  }) => {
    if (authState?.status !== "bothSignedIn") return

    setExportingRegistrationForms((prev) => ({
      ...prev,
      [registrationFormId]: true,
    }))
    try {
      const csvString = await exportRegistrationFormAnswersApi({
        registrationFormId,
        idToken: await authState.firebaseUser.getIdToken(),
      })
      const csv = createCsvBlob(csvString)
      saveAs(csv, `${formName}-answers-${dayjs().format("YYYY-M-D-HH-mm")}.csv`)

      setExportingRegistrationForms((prev) => ({
        ...prev,
        [registrationFormId]: false,
      }))
    } catch (err) {
      addToast({ title: "エラーが発生しました", kind: "error" })
      reportError("failed exporting registration form answers", err)

      setExportingRegistrationForms((prev) => ({
        ...prev,
        [registrationFormId]: false,
      }))
    }
  }

  useEffect(() => {
    ;(async () => {
      if (authState?.status !== "bothSignedIn") return

      try {
        const { registrationForms: fetchedRegistrationForms } =
          await listRegistrationForms({
            idToken: await authState.firebaseUser.getIdToken(),
          })
        setRegistrationForms([
          ...fetchedRegistrationForms,
          ...fetchedRegistrationForms,
        ])
      } catch (err) {
        reportError("failed fetching registration forms", err)
        addToast({ title: "エラーが発生しました", kind: "error" })
        setError("unknown")
      }
    })()
  }, [authState])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>登録申請</h1>
      {registrationForms?.length && !error ? (
        <ul className={styles.registrationForms}>
          {registrationForms.map(({ name, id }) => (
            <li className={styles.rowWrapper} key={id}>
              <Panel
                className={styles.rowInner}
                style={{
                  padding: "24px 32px",
                }}
              >
                <p className={styles.formName}>{name}</p>
                <Tooltip title="回答をCSVでダウンロード">
                  <div className={styles.downloadButton}>
                    <IconButton
                      icon="download"
                      processing={exportingRegistrationForms[id]}
                      onClick={() => {
                        exportAnswers({
                          registrationFormId: id,
                          formName: name,
                        })
                      }}
                    />
                  </div>
                </Tooltip>
              </Panel>
            </li>
          ))}
        </ul>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            {(() => {
              if (error === "unknown") {
                return <p>エラーが発生しました</p>
              }

              if (registrationForms?.length === 0) {
                return <p>登録申請が存在しません</p>
              }

              return <Spinner />
            })()}
          </div>
        </Panel>
      )}
    </div>
  )
}
RegistrationForms.layout = "committee"
RegistrationForms.rbpac = { type: "higherThanIncluding", role: "committee" }

export default RegistrationForms
