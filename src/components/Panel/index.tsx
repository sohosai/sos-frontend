import { FC } from "react"

import styles from "./index.module.scss"

declare namespace Panel {
  type Props = Readonly<
    Partial<{
      padding: number | string
      margin: number | string
      paddingRight: number | string
      paddingLeft: number | string
      paddingTop: number | string
      paddingButtom: number | string
      marginRight: number | string
      marginLeft: number | string
      marginTop: number | string
      marginButtom: number | string
    }>
  >
}

const Panel: FC<Panel.Props> = ({
  padding = 32,
  margin,
  paddingRight,
  paddingLeft,
  paddingTop,
  paddingButtom,
  marginRight,
  marginLeft,
  marginTop,
  marginButtom,
  children,
}) => {
  return (
    <div
      className={styles.wrapper}
      style={{
        padding: typeof padding === "number" ? `${padding}px` : padding,
        margin: typeof margin === "number" ? `${margin}px` : margin,
        paddingRight:
          typeof paddingRight === "number" ? `${paddingRight}px` : paddingRight,
        paddingLeft:
          typeof paddingLeft === "number" ? `${paddingLeft}px` : paddingLeft,
        paddingTop:
          typeof paddingTop === "number" ? `${paddingTop}px` : paddingTop,
        paddingBottom:
          typeof paddingButtom === "number"
            ? `${paddingButtom}px`
            : paddingButtom,
        marginRight:
          typeof marginRight === "number" ? `${marginRight}px` : marginRight,
        marginLeft:
          typeof marginLeft === "number" ? `${marginLeft}px` : marginLeft,
        marginTop: typeof marginTop === "number" ? `${marginTop}px` : marginTop,
        marginBottom:
          typeof marginButtom === "number" ? `${marginButtom}px` : marginButtom,
      }}
    >
      {children}
    </div>
  )
}

export { Panel }
