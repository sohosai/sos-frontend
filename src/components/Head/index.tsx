import { FC } from "react"

import NextHead from "next/head"

export const Head: FC<{ title: string }> = ({ title }) => (
  <NextHead>
    <title key="title">{`${title} | 雙峰祭オンラインシステム`}</title>
  </NextHead>
)
