import { ReactElement } from "react"

import type { AppProps } from "next/app"
import Head from "next/head"
import type { PageOptions } from "next"

import { AuthProvider } from "../contexts/auth"

import { useIfSupported } from "../hooks/useIfSupported"

import { Layout } from "../layouts/layout"

import "normalize.css"
import "../styles/globals.scss"

function MyApp({
  Component,
  pageProps,
}: {
  Component: AppProps["Component"] & PageOptions
  pageProps: AppProps["pageProps"]
}): ReactElement {
  useIfSupported()

  return (
    <>
      <Head>
        <html lang="ja" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title key="title">雙峰祭オンラインシステム</title>
        <meta name="robots" content="noindex" key="robots" />
        <meta name="googlebot" content="noindex" key="googlebot" />
      </Head>
      <AuthProvider>
        <Layout layout={Component.layout}>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  )
}

export default MyApp
