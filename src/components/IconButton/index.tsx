import type { FC } from "react"

import { dataset } from "src/utils/dataset"

import { Spinner } from "src/components"

import styles from "./index.module.scss"

declare namespace IconButton {
  type Props = Readonly<{
    icon: string
    size?: "default" | "small"
    danger?: boolean
    processing?: boolean
  }> &
    JSX.IntrinsicElements["button"]
}

const IconButton: FC<IconButton.Props> = ({
  icon,
  size = "default",
  danger = false,
  processing = false,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={styles.button}
      {...dataset({
        size,
        danger,
        processing,
      })}
      {...rest}
    >
      <div className={styles.spinnerWrapper}>
        <Spinner size={size === "default" ? "sm" : "xs"} />
      </div>
      <div className={styles.iconWrapper}>
        <span className={`jam-icons jam-${icon} ${styles.icon}`} />
      </div>
    </button>
  )
}

export { IconButton }
