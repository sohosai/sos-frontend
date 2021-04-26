import { PageFC } from "next"

import { Panel } from "../components"

import styles from "./accept-subowner.module.scss"

const AcceptSubowner: PageFC = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>副責任者登録</h1>
      <Panel></Panel>
    </div>
  )
}
AcceptSubowner.layout = "default"
AcceptSubowner.rbpac = { type: "higherThanIncluding", role: "general" }

export default AcceptSubowner
