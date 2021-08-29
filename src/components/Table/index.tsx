import { FC, ReactNode } from "react"

import styles from "./index.module.scss"

declare namespace Table {
  type TableProps = {
    keyFlexGrow?: number
    valueFlexGrow?: number
  }

  type RowProps = {
    keyElement: ReactNode
    keyFlexGrow?: number
    valueElement: ReactNode
    valueFlexGrow?: number
    className?: string
  }
}

const Row: FC<Table.RowProps> = ({
  keyElement,
  keyFlexGrow,
  valueElement,
  valueFlexGrow,
  className = "",
}) => (
  <div className={`${styles.tableRow} ${className}`}>
    <div
      className={styles.tableRowKey}
      style={{
        flexGrow: keyFlexGrow,
      }}
    >
      {keyElement}
    </div>
    <div
      className={styles.tableRowValue}
      style={{
        flexGrow: valueFlexGrow,
      }}
    >
      {valueElement}
    </div>
  </div>
)

const Table: FC<Table.TableProps> & {
  Row: typeof Row
} = ({ keyFlexGrow = 1, valueFlexGrow = 2, children }) => {
  return (
    <div
      className={styles.table}
      style={{
        ["--key-flex-grow" as any]: keyFlexGrow,
        ["--value-flex-grow" as any]: valueFlexGrow,
      }}
    >
      {children}
    </div>
  )
}
Table.Row = Row

export { Table }
