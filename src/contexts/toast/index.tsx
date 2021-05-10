import { createContext, useContext, FC } from "react"

import { useToastCore } from "./useToastCore"

type ToastDispatcher = Pick<ReturnType<typeof useToastCore>, "addToast">

const toastDispatcherContext =
  createContext<ToastDispatcher | undefined>(undefined)

const useToastDispatcher = (): ToastDispatcher => {
  const context = useContext(toastDispatcherContext)
  if (!context) throw new Error("toastDispatcher context not found")
  return context
}

type ToastConsumer = Omit<ReturnType<typeof useToastCore>, "addToast">

const toastConsumerContext = createContext<ToastConsumer | undefined>(undefined)

const useToastConsumer = (): ToastConsumer => {
  const context = useContext(toastConsumerContext)
  if (!context) throw new Error("toastConsumer context not found")
  return context
}

const ToastProvider: FC = ({ children }) => {
  const { refMap, addToast, transitions } = useToastCore()

  return (
    <>
      <toastDispatcherContext.Provider value={{ addToast }}>
        <toastConsumerContext.Provider value={{ refMap, transitions }}>
          {children}
        </toastConsumerContext.Provider>
      </toastDispatcherContext.Provider>
    </>
  )
}

export { useToastDispatcher, useToastConsumer, ToastProvider }
