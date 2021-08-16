import { useRouter } from "next/router"
import { useEffect } from "react"

import { pagesPath } from "../utils/$path"

const useIfSupported = (): void => {
  const router = useRouter()
  const isInNotSupportedPage =
    router.pathname === pagesPath.not_supported.$url().pathname

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase()

    if (
      ua.includes("msie") ||
      ua.includes("trident") ||
      window.matchMedia("not all and (min-width: 768px)").matches ||
      !window.matchMedia("(hover: hover)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      router.push(pagesPath.not_supported.$url())
    } else {
      if (isInNotSupportedPage) router.push(pagesPath.$url())
    }
  }, [isInNotSupportedPage])
}

export { useIfSupported }
