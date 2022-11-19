import type { PageFC } from "next"

import styles from "./index.module.scss"
import { Panel } from "src/components"

const Index: PageFC = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>雙峰祭オンラインシステム</h1>
      <section className={styles.section} data-section="farewell-comment">
        <div className={styles.panelRowWrapper}>
          <div className={styles.panelWrapper}>
            <Panel>
              <h2 className={styles.panelTitle}>
                第48回筑波大学学園祭
                「雙峰祭」へのご参加ありがとうございました。
              </h2>
              <div className={styles.sectionInPanel}>
                <p className={styles.panelText}>
                  第48回筑波大学学園祭「雙峰祭」は、１１月５日から１１月６日にわたって開催いたしました。
                </p>
                <p className={styles.panelText}>
                  これに伴い、本サービスは１１月１９日をもって提供を停止いたします。
                </p>
                <p>
                  雙峰祭にご参加いただいた企画者のみなさまに、厚く御礼申し上げます。
                </p>
                <p className={styles.panelText}>また来年お会いしましょう!</p>
              </div>
            </Panel>
          </div>
        </div>
      </section>
      <section className={styles.section} data-section="farewell-comment">
        <div className={styles.panelRowWrapper}>
          <div className={styles.panelWrapper}>
            <Panel>
              <h2 className={styles.panelTitle}>
                本システムに提出されたデータの取り扱いについて
              </h2>
              <div className={styles.sectionInPanel}>
                <p className={styles.panelText}>
                  なお、雙峰祭オンラインシステムにご提出いただいたデータは、サービス提供当初よりご案内しておりますプライバシーポリシーに従い、本年の引き継ぎ業務が済み次第速やかに破棄いたします。
                  ご不明点のある方は、
                  <a href="mailto:info@sohosai.com">info@sohosai.com</a>{" "}
                  へお問合せください。
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </section>
    </div>
  )
}
Index.layout = "default"
Index.rbpac = { type: "public" }

export default Index
