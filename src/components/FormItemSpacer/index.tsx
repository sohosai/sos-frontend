import { FC } from "react"

import styles from "./index.module.scss"

declare namespace FormItemSpacer {
  type Props = {
    marginBottom?: string | number
  }
}

const FormItemSpacer: FC<FormItemSpacer.Props> = ({
  marginBottom = 32,
  children,
}) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        ["--margin-bottom" as any]:
          typeof marginBottom === "number" ? `${marginBottom}px` : marginBottom,
      }}
    >
      {children}
    </div>
  )
}

export { FormItemSpacer }
