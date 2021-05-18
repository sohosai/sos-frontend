import { FC } from "react"

import { Story } from "@storybook/react"

import { useToastDispatcher, ToastProvider } from "src/contexts/toast"

import { ToastHub } from "."
import { Button } from "src/components"
import type { Toast } from "src/components"

import styles from "./index.stories.module.scss"

export default {
  title: ToastHub.name,
  component: ToastHub,
}

const randomNumber = (max: number) => Math.floor(Math.random() * ++max)

const ToastKindArray: Array<Toast.Props["kind"]> = ["info", "success", "error"]

const sampleParagraph = [
  "吾輩は猫である",
  "名前はまだ無い",
  "どこで生れたかとんと見当がつかぬ",
  "何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している",
  "吾輩はここで始めて人間というものを見た",
]

const Main: FC = () => {
  const { addToast } = useToastDispatcher()

  return (
    <div className={styles.wrapper}>
      <Button
        icon="plus"
        onClick={() => {
          addToast({
            title: sampleParagraph[randomNumber(sampleParagraph.length - 1)],
            descriptions:
              randomNumber(2) === 0
                ? [sampleParagraph[randomNumber(sampleParagraph.length - 1)]]
                : undefined,
            kind: ToastKindArray[randomNumber(2)],
          })
        }}
      >
        Toastを追加
      </Button>
      <div className={styles.toastHubWrapper}>
        <ToastHub />
      </div>
    </div>
  )
}

export const Index: Story = () => (
  <ToastProvider>
    <Main />
  </ToastProvider>
)

Index.parameters = {
  layout: "fullscreen",
}
