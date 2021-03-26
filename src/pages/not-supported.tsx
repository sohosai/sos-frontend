import { PageFC } from "next"
import Head from "next/head"

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
      <h1 className={styles.title}>
        {isIe
          ? "Internet Explorer ではご利用いただけません"
          : "スマートフォンや小さなウィンドウではご利用いただけません"}
      </h1>
      <p className={styles.paragraph}>
        {isIe
          ? "Google Chrome / Mozilla Firefox などのモダンブラウザをご利用ください"
          : "PC からご利用ください"}
      </p>
    </div>
  )
}
NotSupported.layout = "empty"
NotSupported.rbpac = { type: "public" }

export default NotSupported
