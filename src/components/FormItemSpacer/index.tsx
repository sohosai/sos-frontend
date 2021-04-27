import { FC } from "react"

import styles from "./index.module.scss"

declare namespace FormItemSpacer {
  type Props = Readonly<{ marginBottom?: string }> &
    JSX.IntrinsicElements["div"]
}

const FormItemSpacer: FC<FormItemSpacer.Props> = ({
  marginBottom = "32px",
  children,
  ...rest
}) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        ["--margin-bottom" as any]: marginBottom,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export { FormItemSpacer }
