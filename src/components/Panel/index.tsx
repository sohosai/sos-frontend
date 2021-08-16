import { CSSProperties, FC } from "react"

import styles from "./index.module.scss"
import { dataset } from "src/utils/dataset"

declare namespace Panel {
  type Props = Readonly<{
    style?: CSSProperties
    className?: string
    hoverStyle?: "none" | "brand" | "gray"
  }>
}

const Panel: FC<Panel.Props> = ({
  style,
  className,
  hoverStyle = "none",
  children,
}) => {
  return (
    <div
      className={`${styles.wrapper} ${className}`}
      style={{
        padding: "32px",
        ...style,
      }}
      {...dataset({
        hoverStyle: hoverStyle ?? false,
      })}
    >
      {children}
    </div>
  )
}

export { Panel }
