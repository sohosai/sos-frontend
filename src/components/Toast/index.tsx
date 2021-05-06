import { FC } from "react"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Toast {
  type Props = Readonly<{
    kind?: "info" | "success" | "error"
    title: string
    descriptions?: string[]
    progress: string
  }> &
    JSX.IntrinsicElements["div"]
}

const iconMap: {
  [kind in NonNullable<Toast.Props["kind"]>]: string
} = {
  info: "info",
  success: "check-circle",
  error: "triangle-danger",
}

const Toast: FC<Toast.Props> = ({
  kind = "info",
  title,
  descriptions = [],
  progress,
  ...rest
}) => {
  return (
    <div className={styles.wrapper} {...dataset({ kind })} {...rest}>
      <div className={styles.iconWrapper}>
        <i className={`jam-icons jam-${iconMap[kind]} ${styles.icon}`} />
        <div
          className={styles.iconProgress}
          aria-hidden
          style={{
            height: progress,
          }}
        />
      </div>
      <div className={styles.textWrapper}>
        <p className={styles.title}>{title}</p>
        {Boolean(descriptions.length) && (
          <div className={styles.descriptionsWrapper}>
            {descriptions.map((text, index) => (
              <p className={styles.description} key={index}>
                {text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { Toast }
