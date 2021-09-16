import { FC } from "react"

import isURL, { IsURLOptions } from "validator/lib/isURL"

import styles from "./index.module.scss"

declare namespace Paragraph {
  type Props = Readonly<{
    text: string | string[]
    parseUrl?: boolean
    normalTextClassName?: string
    urlClassName?: string
    urlWrapperDivClassName?: string
    isURLOptions?: IsURLOptions
    dangerouslyDisableForceExternal?: boolean
  }>
}

const Paragraph: FC<Paragraph.Props> = ({
  text,
  parseUrl = true,
  normalTextClassName = "",
  urlClassName = "",
  urlWrapperDivClassName = "",
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
        parseUrl &&
        isURL(txt, {
          protocols: ["http", "https"],
          ...isURLOptions,
        }) ? (
          <div className={urlWrapperDivClassName}>
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

export { Paragraph }
