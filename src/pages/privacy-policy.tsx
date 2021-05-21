import { PageFC } from "next"

import { Head, Panel } from "src/components"

import styles from "./privacy-policy.module.scss"

const PrivacyPolicy: PageFC = () => {
  return (
    <div className={styles.wrapper}>
      <Head title="プライバシーポリシー" />
      <h1 className={styles.title}>プライバシーポリシー</h1>
      <Panel>
        <section className={styles.section}>
          <p>
            雙峰祭オンラインシステムでは利用者の皆さまの個人情報を以下の通り取り扱います。
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ガイドラインの遵守について</h2>
          <p>
            本システムの運用では、企画団体の各種情報(個人情報を含む)を個人情報保護委員会が定める
            <a
              href="https://www.ppc.go.jp/legal/policy/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.anchorLink}
            >
              「特定個人情報の適正な取扱いに関するガイドライン(事業者編)」
            </a>
            に従って管理および保護します。
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>個人情報の収集と保管について</h2>
          <p>
            学実委では、本システム内で企画団体から提供いただいた個人情報を第三者に漏洩することのないよう、厳重に保管いたします。また、学実委内部においても個人情報は厳重に管理し、企画責任者または副企画責任者から事前に許可を得ることなく以下の目的以外では使用いたしません。
          </p>
          <ul className={styles.list}>
            <li>学園祭の実施に関わる学実委からの連絡・調整</li>
            <li>全代会及び大学に提出する実行計画書の作成</li>
          </ul>
          <p>
            なお、個人・企画団体が特定できない形式での統計的資料等の作成を行う場合がございます。
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            個人情報の第三者への提供について
          </h2>
          <p>
            以下のいずれかに該当する場合、企画責任者・副企画責任者の個人情報を学実委以外の第三者に開示する場合がございます。
          </p>
          <ul className={styles.list}>
            <li>学実委が全代会及び大学に実行計画書を提出する場合</li>
            <li>司法機関または行政機関から法的義務を伴う要請を受けた場合</li>
            <li>大学から学則に基づく要請を受けた場合</li>
          </ul>
          <p>
            なお、以上の情報提供機関(特に、全代会及び大学)に対しては、個人情報を厳重な管理体制の下で保管し、当プライバシーポリシーに反する取扱いを一切行わないよう要請いたします。
          </p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Cookieやログファイルの利用について
          </h2>
          <p>
            本システムでは、Google
            Analyticsを利用してCookieの使用やログファイルの収集により利用者の皆さまのIPアドレス/ご利用ブラウザ/OS/使用端末などの情報を収集しています。
            これらの情報はシステムの利便性向上やトラブル時の原因究明を目的に収集しており、個人を特定する目的での利用はしておりません。
            なお、ご利用のブラウザの設定などによって収集される情報を管理することができます。詳しくは
            <a
              className={styles.anchorLink}
              href="https://policies.google.com/technologies/partner-sites?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
            >
              こちら
            </a>
            をご確認ください。
          </p>
        </section>
      </Panel>
    </div>
  )
}
PrivacyPolicy.layout = "default"
PrivacyPolicy.rbpac = { type: "public" }

export default PrivacyPolicy
