import { PageFC } from "next"

import styles from "./404.module.scss"
import { PageError, Panel } from "src/components"

const Custom404: PageFC = () => {
  return (
    <div className={styles.wrapper}>
      <Panel>
        <div className={styles.panelInner}>
          <PageError
            statusCode={404}
            messages={["お探しのページが見つかりませんでした"]}
          />
        </div>
      </Panel>
    </div>
  )
}
Custom404.layout = "default"
Custom404.rbpac = { type: "public" }

export default Custom404
