import { PageFC } from "next"
import Head from "next/head"

import { Panel } from "../components"

import styles from "./not-supported.module.scss"

const NotSupported: PageFC = () => {
  if (!process.browser) return <></>

  const ua = window.navigator.userAgent.toLowerCase()
  const isIe = ua.includes("msie") || ua.includes("trident")

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>非対応ブラウザ</title>
      </Head>
      <Panel>
        <i className={`jam-icons jam-alert ${styles.icon}`} aria-hidden />
        <h1 className={styles.title}>
          {isIe ? "非対応ブラウザ" : "非対応デバイス"}
        </h1>
        {isIe ? (
          <>
            <p className={styles.paragraph}>
              Internet Explorer ではご利用いただけません
            </p>
            <p className={styles.paragraph}>
              {
                "Google Chrome / Mozilla Firefox などのモダンブラウザをご利用ください"
              }
            </p>
          </>
        ) : (
          <>
            <p className={styles.paragraph}>
              スマートフォンや小さなウィンドウではご利用いただけません
            </p>
            <p className={styles.paragraph}>PC からご利用ください</p>
          </>
        )}
        <p className={styles.sos}>雙峰祭オンラインシステム</p>
      </Panel>
    </div>
  )
}
NotSupported.layout = "empty"
NotSupported.rbpac = { type: "public" }

export default NotSupported
