import { FC } from "react"

import styles from "./index.module.scss"

declare namespace Spinner {
  type Props = Readonly<
    Partial<{
      color: string
      size: "sm" | "md"
    }>
  >
}

const Spinner: FC<Spinner.Props> = ({ color = "#000", size = "md" }) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        ["--spinner-color" as any]: color,
      }}
      data-size={size}
    >
      <svg className={styles.circular}>
        <circle className={styles.path} pathLength="100" />
      </svg>
    </div>
  )
}

export { Spinner }
