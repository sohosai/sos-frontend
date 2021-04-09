import { CSSProperties, FC } from "react"

import styles from "./index.module.scss"

declare namespace Panel {
  type Props = Readonly<{ style?: CSSProperties }>
}

const Panel: FC<Panel.Props> = ({ style, children }) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        padding: "32px",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export { Panel }
