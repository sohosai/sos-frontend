import { PageFC } from "next"
import { useState } from "react"

import { Button, Head, Panel } from "../components"
import styles from "./email-verification.module.scss"
import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { reportError } from "src/lib/errorTracking/reportError"

const EmailVerification: PageFC = () => {
  const [processing, setProcessing] = useState(false)
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<
    undefined | "mailSent" | "error"
  >(undefined)

  const { sendEmailVerification, signout } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const resendVerification = () => {
    setProcessing(true)

    sendEmailVerification()
      .then(() => {
        setProcessing(false)
        setEmailVerificationStatus("mailSent")
      })
      .catch((err) => {
        setProcessing(false)
        addToast({ title: "エラーが発生しました", kind: "error" })
        setEmailVerificationStatus("error")
        reportError("failed to re-send email verification email", {
          error: err,
        })
      })
  }

  return (
    <div className={styles.wrapper}>
      <Head title="メールアドレスの確認" />
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
              <p className={styles.description}>
                {/* TODO: ここ、どう考えても環境変数にするべきだけど知らん知らん!!! ごめん..... */}
                受信できない場合、system@sohosai.com
                からのメールが迷惑メールフォルダに配信されていないかご確認ください
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
              <div className={styles.logoutButtonWrapper}>
                <Button
                  icon="log-out-alt"
                  kind="secondary"
                  size="small"
                  fullWidth={true}
                  onClick={() => {
                    if (window.confirm("ログアウトしますか?")) {
                      signout()
                    }
                  }}
                >
                  ログアウト
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
              <p className={styles.description}>
                しばらく時間を置いてから再度お試しください
              </p>
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
