import type { FC } from "react"

import styles from "./index.module.scss"

declare namespace IconButton {
  type Props = Readonly<{
    icon: string
    size?: "default" | "small"
    danger?: boolean
  }> &
    JSX.IntrinsicElements["button"]
}

const IconButton: FC<IconButton.Props> = ({
  icon,
  size = "default",
  danger = false,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={styles.button}
      data-size={size}
      data-danger={danger}
      {...rest}
    >
      <i className={`jam-icon jam-${icon} ${styles.icon}`} />
    </button>
  )
}

export { IconButton }
