import { Story } from "@storybook/react"

import { Panel } from "../"

import styles from "./index.stories.module.scss"

export default {
  title: "IconCatalogue",
  component: null,
}

const icons = [
  "log-in-alt",
  "log-out-alt",
  "checkbox",
  "user-f",
  "phone-alt",
  "more-horizontal-f",
  "more-vertical-f",
]

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
          <div className={styles.panelWrapper} key={icon} data-icon={icon}>
            <Panel>
              <i className={`jam-icons jam-${icon} ${styles.icon}`} />
            </Panel>
          </div>
        ))}
      </div>
    </>
  )
}
