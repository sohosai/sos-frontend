import { VFC } from "react"

import styles from "./index.module.scss"

declare namespace PageError {
  type Props = {
    statusCode: number
    StatusCodeTagName?: "p" | "h1" | "h2" | "h3" | "h4" | "h5"
    messages: string[]
  }
}

const PageError: VFC<PageError.Props> = ({
  statusCode,
  StatusCodeTagName = "h1",
  messages,
}) => {
  return (
    <div className={styles.wrapper}>
      <StatusCodeTagName className={styles.statusCode}>
        {statusCode}
      </StatusCodeTagName>
      <div className={styles.messages}>
        {messages.map((text) => (
          <p className={styles.message} key={text}>
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}

export { PageError }
