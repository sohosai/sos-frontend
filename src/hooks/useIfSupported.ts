import { useEffect } from "react"

import { useRouter } from "next/router"

const useIfSupported = (): void => {
  const router = useRouter()
  const isInNotSupportedPage = router.pathname === "/not-supported"

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase()

    if (
      ua.includes("msie") ||
      ua.includes("trident") ||
      window.matchMedia("not all and (min-width: 768px)").matches ||
      !window.matchMedia("(hover: hover)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      router.push("/not-supported")
    } else {
      if (isInNotSupportedPage) router.push("/")
    }
  }, [isInNotSupportedPage])
}

export { useIfSupported }
