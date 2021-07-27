import NextHead from "next/head"
import { FC } from "react"

export const Head: FC<{ title: string }> = ({ title }) => (
  <NextHead>
    <title key="title">{`${title} | 雙峰祭オンラインシステム`}</title>
  </NextHead>
)
