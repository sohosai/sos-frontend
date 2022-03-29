import type { PageFC } from "next"

import { Button, Head, Panel } from "../components"
import { useAuthNeue } from "../contexts/auth"

import styles from "./me.module.scss"
import { userTypeToUiText } from "src/types/models/user"

const Mypage: PageFC = () => {
  const { authState, signout } = useAuthNeue()

  return (
    <div className={styles.wrapper}>
      <Head title="マイページ" />
      <h1 className={styles.title}>マイページ</h1>
      {authState?.status === "bothSignedIn" && (
        <>
          <div className={styles.panelsWrapper}>
            <div className={styles.panelWrapper}>
              <Panel>
                <p
                  className={styles.name}
                >{`${authState.sosUser.name.last} ${authState.sosUser.name.first}`}</p>
                <p
                  className={styles.kanaName}
                >{`${authState.sosUser.kana_name.last} ${authState.sosUser.kana_name.first}`}</p>
              </Panel>
            </div>
            <div className={styles.panelWrapper}>
              <Panel>
                <h2 className={styles.panelTitle}>区分</h2>
                <p className={styles.panelText}>
                  <i
                    className={`jam-icons jam-id-card ${styles.panelTextIcon}`}
                  />
                  {userTypeToUiText(authState.sosUser.type)}
                </p>
              </Panel>
            </div>
            <div className={styles.panelWrapper}>
              <Panel>
                <h2 className={styles.panelTitle}>連絡先</h2>
                <p className={styles.panelText}>
                  <i
                    className={`jam-icons jam-envelope ${styles.panelTextIcon}`}
                  />
                  {authState.sosUser.email}
                </p>
                <p className={styles.panelText}>
                  <i
                    className={`jam-icons jam-phone-alt ${styles.panelTextIcon}`}
                  />
                  {`0${authState.sosUser.phone_number.slice(3)}`}
                </p>
              </Panel>
            </div>
            {
              // TODO: password change
            }
            <div className={styles.logoutButtonWrapper}>
              <Button
                icon="log-out-alt"
                kind="secondary"
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
          </div>
        </>
      )}
    </div>
  )
}
Mypage.layout = "default"
Mypage.rbpac = { type: "higherThanIncluding", role: "general" }

export default Mypage
