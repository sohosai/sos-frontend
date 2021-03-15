import { FC } from "react"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Button {
  type Props = Readonly<{
    kind?: "primary" | "secondary"
    size?: "default" | "small"
    type?: "button" | "submit" | "reset"
    disabled?: boolean
  }>
}

const Button: FC<Button.Props> = ({
  kind = "primary",
  size = "default",
  type = "button",
  disabled = false,
  children,
}) => {
  return (
    <button
      type={type}
      className={styles.button}
      {...dataset({ kind, size, disabled })}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export { Button }
