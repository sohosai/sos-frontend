import React, { FC, MouseEvent, useState } from "react"
import { Panel } from "../Panel"
import styles from "./index.module.scss"

type Props = {
  close: () => void
}

const Modal: FC<Props> = ({ close, children }) => {
  const [isMouseDown, setIsMouseDown] = useState(false)

  const onMouseDown = (e: MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      setIsMouseDown(true)
    }
  }

  const onMouseUp = () => {
    if (isMouseDown) {
      close()
    }
    setIsMouseDown(false)
  }

  return (
    <div
      className={styles.modal}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <Panel className={styles.modalPanel}>{children}</Panel>
    </div>
  )
}

export { Modal }
