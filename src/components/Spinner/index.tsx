import { FC } from "react"

import styles from "./index.module.scss"

declare namespace Spinner {
  type Props = Partial<{
    color: string
    radius: number
    lineWidth: number
  }>
}

const Spinner: FC<Spinner.Props> = ({
  color = "#000",
  radius = 28,
  lineWidth = 2,
}) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        ["--spinner-color" as any]: color,
        ["--spinner-radius" as any]: `${radius}px`,
        ["--spinner-line-width" as any]: `${lineWidth}px`,
      }}
    >
      <svg className={styles.circular}>
        <circle className={styles.path} />
      </svg>
    </div>
  )
}

export { Spinner }
