import { FC } from "react"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Button {
  type Props = Readonly<{
    kind?: "primary" | "secondary"
    size?: "default" | "small"
    type?: "button" | "submit" | "reset"
  }>
}

const Button: FC<Button.Props> = ({
  kind = "primary",
  size = "default",
  type = "button",
  children,
}) => {
  return (
    <button type={type} className={styles.button} {...dataset({ kind, size })}>
      {children}
    </button>
  )
}

export { Button }
