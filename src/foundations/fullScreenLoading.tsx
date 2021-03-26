import { FC } from "react"

import { Spinner } from "../components"

import styles from "./fullScreenLoading.module.scss"

export const FullScreenLoading: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Spinner color="gray" />
    </div>
  )
}
