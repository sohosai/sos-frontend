import { ReactElement } from "react"

import type { AppProps } from "next/app"
import Head from "next/head"

import "../styles/globals.scss"

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title key="title">雙峰祭オンラインシステム</title>
        <meta name="robots" content="noindex" key="robots" />
        <meta name="googlebot" content="noindex" key="googlebot" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
