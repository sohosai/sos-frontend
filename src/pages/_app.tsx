import type { PageOptions } from "next"
import type { AppProps } from "next/app"
import Head from "next/head"
import { ReactElement, useEffect } from "react"

import { AuthProvider } from "../contexts/auth"
import { MyProjectProvider } from "../contexts/myProject"

import { useIfSupported } from "../hooks/useIfSupported"

import { Layout } from "../layouts/layout"
import { ToastProvider } from "src/contexts/toast"

import "normalize.css"
import "../styles/globals.scss"

function MyApp({
  Component,
  pageProps,
}: {
  Component: AppProps["Component"] & PageOptions
  pageProps: AppProps["pageProps"]
}): ReactElement {
  // useIfSupported()

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging") {
      window.alert(
        "こちらはSOSの実委内テスト環境です\n本番環境とはデータなどが一切同期されておりませんので、お間違いのないようご注意ください"
      )
    }
  }, [])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title key="title">雙峰祭オンラインシステム</title>
        <meta name="robots" content="noindex" key="robots" />
        <meta name="googlebot" content="noindex" key="googlebot" />
        {Boolean(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');`,
              }}
            ></script>
          </>
        )}
      </Head>
      <ToastProvider>
        <AuthProvider rbpac={Component.rbpac}>
          <MyProjectProvider>
            <Layout layout={Component.layout}>
              <Component {...pageProps} />
            </Layout>
          </MyProjectProvider>
        </AuthProvider>
      </ToastProvider>
    </>
  )
}

export default MyApp
