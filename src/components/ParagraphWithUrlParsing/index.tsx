import { FC } from "react"

import isURL, { IsURLOptions } from "validator/lib/isURL"

import styles from "./index.module.scss"

declare namespace ParagraphWithUrlParsing {
  type Props = Readonly<{
    text: string | string[]
    normalTextClassName?: string
    urlClassName?: string
    isURLOptions?: IsURLOptions
    dangerouslyDisableForceExternal?: boolean
  }>
}

const ParagraphWithUrlParsing: FC<ParagraphWithUrlParsing.Props> = ({
  text,
  normalTextClassName = "",
  urlClassName = "",
  isURLOptions,
  dangerouslyDisableForceExternal = false,
}) => {
  const splitTexts = (
    Array.isArray(text)
      ? text.map((txt) => txt.split("\n")).flat()
      : text.split("\n")
  ).map((text) => text.trim())

  return (
    <div className={styles.wrapper}>
      {splitTexts.map((txt) =>
        isURL(txt, {
          protocols: ["http", "https"],
          ...isURLOptions,
        }) ? (
          <div>
            <a
              href={
                !dangerouslyDisableForceExternal && !txt.startsWith("http")
                  ? "//" + txt
                  : txt
              }
              target="_blank"
              rel="noreferrer noopener"
              className={`${styles.url} ${urlClassName}`}
            >
              {txt}
            </a>
          </div>
        ) : (
          <p
            key={txt}
            className={`${styles.normalText} ${normalTextClassName}`}
          >
            {txt}
          </p>
        )
      )}
    </div>
  )
}

export { ParagraphWithUrlParsing }
