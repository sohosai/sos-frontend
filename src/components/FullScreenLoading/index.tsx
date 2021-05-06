import { FC } from "react"

import { Spinner } from "../"

import styles from "./index.module.scss"

export const FullScreenLoading: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Spinner color="gray" />
    </div>
  )
}
