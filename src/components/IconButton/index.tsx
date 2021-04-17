import type { FC } from "react"

import styles from "./index.module.scss"

declare namespace IconButton {
  type Props = Readonly<{
    size?: "default" | "small"
    icon: string
  }> &
    JSX.IntrinsicElements["button"]
}

const IconButton: FC<IconButton.Props> = ({
  size = "default",
  icon,
  ...rest
}) => {
  return (
    <button type="button" className={styles.button} data-size={size} {...rest}>
      <i className={`jam-icon jam-${icon} ${styles.icon}`} />
    </button>
  )
}

export { IconButton }
