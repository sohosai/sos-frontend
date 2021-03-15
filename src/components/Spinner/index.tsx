import { FC } from "react"

import styles from "./index.module.scss"

declare namespace Spinner {
  type Props = Readonly<
    Partial<{
      color: "gray" | "white" | "brand"
      size: "sm" | "md"
    }>
  >
}

const Spinner: FC<Spinner.Props> = ({ color = "gray", size = "md" }) => {
  return (
    <div className={styles.wrapper} data-size={size} data-color={color}>
      <svg className={styles.circular}>
        <circle className={styles.path} pathLength="100" />
      </svg>
    </div>
  )
}

export { Spinner }
