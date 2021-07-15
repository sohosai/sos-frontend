import { useRef, useEffect, FC } from "react"

import type { PageOptions } from "next"
import { useRouter } from "next/router"

import { Sidebar } from "./sidebar"

import { Footer, ToastHub } from "src/components"

import styles from "./layout.module.scss"

const Layout: FC<Pick<PageOptions, "layout">> = ({ layout, children }) => {
  const router = useRouter()

  const mainArea = useRef<HTMLDivElement>(null)

  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      if (mainArea.current) mainArea.current.scrollTop = 0
    })
  }, [])

  if (layout === "empty") return <>{children}</>

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <Sidebar layout={layout} />
      </div>
      <div className={styles.mainArea} ref={mainArea}>
        {children}
        <Footer />
      </div>
      <div className={styles.toastHubWrapper}>
        <ToastHub />
      </div>
    </div>
  )
}

export { Layout }
