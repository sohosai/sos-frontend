import { FC } from "react"

import styles from "./index.module.scss"

export type StepProps = Readonly<{
  title: string
  index: number
  active: boolean
}>

const Step: FC<StepProps> = ({ title, index, active }) => {
  return (
    <div className={styles.stepWrapper}>
      <div
        className={styles.stepIcon}
        data-active={active}
        data-index={index}
        aria-hidden
      />
      <div className={styles.titleWrapper}>
        <p className={styles.title}>{title}</p>
      </div>
    </div>
  )
}

const StepContent: FC = ({ children }) => (
  <div className={styles.stepperContent}>{children}</div>
)

const Divider: FC = () => <div className={styles.divider} aria-hidden />

const Stepper: FC & {
  Step: typeof Step
  StepContent: typeof StepContent
  Divider: typeof Divider
} = ({ children }) => <>{children}</>

Stepper.Step = Step
Stepper.StepContent = StepContent
Stepper.Divider = Divider

export { Stepper }
