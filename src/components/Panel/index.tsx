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

const normalize = (value: string | number): string => {
  return typeof value === "string" ? value : `${value}px`
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
  // インラインスタイルに書くとページ遷移後に効かなくなる(バグ?)ので一回オブジェクトに入れる
  const style = {
    padding: normalize(padding),
    margin: normalize(margin),
    paddingRight: normalize(paddingRight),
    paddingLeft: normalize(paddingLeft),
    paddingTop: normalize(paddingTop),
    paddingButtom: normalize(paddingButtom),
    marginRight: normalize(marginRight),
    marginLeft: normalize(marginLeft),
    marginTop: normalize(marginTop),
    marginButtom: normalize(marginButtom),
  }

  return (
    <div className={styles.wrapper} style={style}>
      {children}
    </div>
  )
}

export { Panel }
