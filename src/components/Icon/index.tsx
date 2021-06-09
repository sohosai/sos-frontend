import { FC } from "react"

import styles from "./index.module.scss"

declare namespace Icon {
  type Props = {
    icon: string
    className?: string
    ariaHidden?: boolean
    ariaLabel?: string
  } & JSX.IntrinsicElements["span"]
}

const Icon: FC<Icon.Props> = ({
  icon,
  className,
  ariaHidden,
  ariaLabel,
  ...rest
}) => (
  <span
    className={`jam-icons jam-${icon} ${styles.icon} ${className ?? ""}`}
    aria-hidden={ariaHidden}
    aria-label={ariaLabel}
    {...rest}
  />
)

export { Icon }
