import { animated, SpringValue } from "@react-spring/web"
import { FC } from "react"

import styles from "./index.module.scss"
import { Toast } from "src/components/"
import { useToastConsumer } from "src/contexts/toast/"

const AnimatedToast = animated(Toast)

const ToastHub: FC = () => {
  const { refMap, transitions } = useToastConsumer()

  return (
    <div>
      {transitions(({ progress, ...style }, item) => (
        <animated.div
          ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
          style={style}
        >
          <div className={styles.toastWrapper}>
            <AnimatedToast
              title={item.toastProps.title}
              descriptions={item.toastProps.descriptions}
              kind={item.toastProps.kind}
              progress={progress as SpringValue<number>}
            />
          </div>
        </animated.div>
      ))}
    </div>
  )
}

export { ToastHub }
