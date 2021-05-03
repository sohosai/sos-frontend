import type { PageFC } from "next"

import { Head } from "../../components"

import styles from "./index.module.scss"

const Committee: PageFC = () => {
  return (
    <div className={styles.wrapper}>
      <Head title="実委人トップページ" />
      <h1>実委人トップページ</h1>
    </div>
  )
}
Committee.layout = "committee"
Committee.rbpac = { type: "higherThanIncluding", role: "committee" }

export default Committee
