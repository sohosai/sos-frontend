import type { FC } from "react"

import { Spinner } from "../"
import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Button {
  type Props = Readonly<{
    kind?: "primary" | "secondary"
    size?: "default" | "small"
    type?: "button" | "submit" | "reset"
    fullWidth?: boolean
    disabled?: boolean
    processing?: boolean
    icon?: string
  }> &
    JSX.IntrinsicElements["button"]
}

const Button: FC<Button.Props> = ({
  kind = "primary",
  size = "default",
  type = "button",
  fullWidth = false,
  disabled = false,
  processing = false,
  icon,
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={styles.button}
      {...dataset({ kind, size, fullWidth, disabled, processing })}
      disabled={disabled}
      {...rest}
    >
      <div className={styles.spinnerWrapper}>
        <Spinner size="sm" color={kind === "primary" ? "white" : "brand"} />
      </div>
      <div className={styles.children}>
        {icon && <i className={`jam-icons jam-${icon} ${styles.icon}`} />}
        {children}
      </div>
    </button>
  )
}

export { Button }
