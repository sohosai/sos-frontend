import { useState } from "react"

import { PageFC } from "next"

import { useAuth } from "../contexts/auth"

import { Button, Panel } from "../components"

import styles from "./email-verification.module.scss"

const EmailVerification: PageFC = () => {
  const [processing, setProcessing] = useState(false)
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<
    undefined | "mailSent" | "error"
  >(undefined)

  const { sendEmailVerification } = useAuth()

  const resendVerification = () => {
    setProcessing(true)

    sendEmailVerification()
      .then(() => {
        setProcessing(false)
        setEmailVerificationStatus("mailSent")
      })
      .catch((err) => {
        setProcessing(false)
        setEmailVerificationStatus("error")
        console.error(err)
      })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.panelWrapper}>
        <Panel style={{ padding: "48px" }}>
          {!emailVerificationStatus && (
            <>
              <h1 className={styles.title}>
                メールアドレスの確認をお願いします
              </h1>
              <p className={styles.description}>
                登録されたメールアドレスに確認メールをお送りしています
              </p>
              <p className={styles.description}>
                メールに記載されたリンクをクリックして登録を完了してください
              </p>
              {/* TODO: アドレスを本番環境のものに差し替え */}
              <p className={styles.description}>
                受信できない場合、noreply@hoge.firebaseapp.comからのメールが迷惑メールフォルダに配信されていないかご確認ください
              </p>
              <p className={styles.description}>
                下のボタンから確認メールを再送することができます
              </p>
              <div className={styles.resendWrapper}>
                <Button
                  kind="secondary"
                  size="small"
                  processing={processing}
                  icon="paper-plane"
                  onClick={resendVerification}
                  fullWidth={true}
                >
                  確認メールを再送する
                </Button>
              </div>
            </>
          )}
          {emailVerificationStatus === "mailSent" && (
            <>
              <h1 className={styles.title}>確認メールを再送しました</h1>
              <p className={styles.description}>
                メールに記載されたリンクをクリックして登録を完了してください
              </p>
            </>
          )}
          {emailVerificationStatus === "error" && (
            <>
              <h1 className={styles.title}>確認メールを再送できませんでした</h1>
              <p className={styles.description}>管理者にお問い合わせください</p>
              {/* TODO: 問い合わせへの動線 */}
            </>
          )}
        </Panel>
      </div>
    </div>
  )
}
EmailVerification.layout = "default"
EmailVerification.rbpac = { type: "lowerThanIncluding", role: "guest" }

export default EmailVerification
