import type { ButtonHTMLAttributes, FC } from "react"

import { dataset } from "../../utils/dataset"

import { Spinner } from "../"

import styles from "./index.module.scss"

declare namespace Button {
  type Props = Readonly<{
    kind?: "primary" | "secondary"
    size?: "default" | "small"
    type?: "button" | "submit" | "reset"
    disabled?: boolean
    processing?: boolean
    icon?: string
    buttonRestAttributes?: ButtonHTMLAttributes<HTMLButtonElement>
  }>
}

const Button: FC<Button.Props> = ({
  kind = "primary",
  size = "default",
  type = "button",
  disabled = false,
  processing = false,
  icon,
  buttonRestAttributes,
  children,
}) => {
  return (
    <button
      type={type}
      className={styles.button}
      {...dataset({ kind, size, disabled, processing })}
      disabled={disabled}
      {...buttonRestAttributes}
    >
      <div className={styles.spinnerWrapper}>
        <Spinner size="sm" color={kind === "primary" ? "white" : "brand"} />
      </div>
      <div className={styles.children}>
        {icon && <i className={`jam-icon jam-${icon} ${styles.icon}`} />}
        {children}
      </div>
    </button>
  )
}

export { Button }
