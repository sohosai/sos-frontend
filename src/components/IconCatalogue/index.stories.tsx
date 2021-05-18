import { useState, FC } from "react"

import { Story } from "@storybook/react"

import { Panel, Tooltip } from "src/components"

import styles from "./index.stories.module.scss"

export default {
  title: "IconCatalogue",
  component: null,
}

const icons = [
  "log-in-alt",
  "log-out-alt",
  "checkbox",
  "check-circle",
  "user-f",
  "phone-alt",
  "more-horizontal-f",
  "more-vertical-f",
]

const timeout = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds))

const IconPanel: FC<{ icon: string }> = ({ icon }) => {
  const [tooltipString, setTooltipString] = useState(icon)

  return (
    <Tooltip title={tooltipString}>
      <div
        className={styles.panelWrapper}
        onClick={async () => {
          await navigator.clipboard.writeText(icon)
          setTooltipString("Copied!!")
          await timeout(1000)
          setTooltipString(icon)
        }}
      >
        <Panel>
          <span className={`jam-icons jam-${icon} ${styles.icon}`} />
        </Panel>
      </div>
    </Tooltip>
  )
}

export const Index: Story = () => {
  return (
    <>
      <div className={styles.top}>
        <h1 className={styles.title}>Custom icons</h1>
        <p className={styles.p}>
          オリジナルの Jam icons に追加しているアイコン
        </p>
      </div>
      <div className={styles.wrapper}>
        {icons.map((icon) => (
          <IconPanel icon={icon} key={icon} />
        ))}
      </div>
    </>
  )
}
