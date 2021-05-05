import { useState, useMemo } from "react"

import { TransitionFn, useTransition } from "@react-spring/web"

import { Toast } from "../../components"

type Item = {
  key: number
  toastProps: Toast.Props
}

const useToastCore = (): {
  refMap: WeakMap<any, any>
  addToast: (toastOptions: Omit<Toast.Props, "progress">) => void
  transitions: TransitionFn<Item, any>
} => {
  const refMap = useMemo(() => new WeakMap(), [])
  const [items, setItems] = useState<Item[]>([])

  const timeout = 8000

  const addToast = (toastOptions: Omit<Toast.Props, "progress">) => {
    setItems((prevItems) => [
      ...prevItems,
      {
        key: prevItems.length ? prevItems.slice(-1)[0].key + 1 : 0,
        toastProps: { ...toastOptions, progress: "0%" },
      },
    ])
  }

  const transitions = useTransition(items, {
    from: (item) => {
      return {
        opacity: 0,
        height: refMap.get(item)?.offsetHeight,
        progress: "0%",
      }
    },
    keys: (item) => item.key,
    enter: (item) => async (next) => {
      await next({
        opacity: 1,
        height: refMap.get(item)?.offsetHeight,
      })
      await next({ progress: "100%" })
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    onRest: (result, ctrl, item) => {
      setItems((state) =>
        state.filter((i) => {
          return i.key !== item.key
        })
      )
    },
    config: (item, index, phase) => (key) =>
      phase === "enter" && key === "progress"
        ? { duration: timeout }
        : { tension: 125, friction: 20, precision: 0.1 },
  })

  return {
    refMap,
    addToast,
    transitions,
  }
}

export { useToastCore }
