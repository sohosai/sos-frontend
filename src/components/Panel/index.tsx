import { CSSProperties, FC } from "react"

import { dataset } from "src/utils/dataset"

import styles from "./index.module.scss"

declare namespace Panel {
  type Props = Readonly<{
    style?: CSSProperties
    hoverStyle?: "none" | "brand" | "gray"
  }>
}

const Panel: FC<Panel.Props> = ({ style, hoverStyle = "none", children }) => {
  return (
    <div
      className={styles.wrapper}
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
