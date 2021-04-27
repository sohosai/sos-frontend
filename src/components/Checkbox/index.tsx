import { FC } from "react"

import { UseFormRegisterReturn } from "react-hook-form"

import { dataset } from "../../utils/dataset"

import styles from "./index.module.scss"

declare namespace Checkbox {
  type Props = Readonly<{
    checked: boolean
    label?: string
    // なぜか restAttributes に入れると動かないので仕方なく
    // ref が渡らないのが原因っぽい?
    register?: UseFormRegisterReturn
  }> &
    JSX.IntrinsicElements["input"]
}

const Checkbox: FC<Checkbox.Props> = ({
  checked,
  label,
  register,
  ...inputRestAttributes
}) => {
  return (
    <div className={styles.wrapper} {...dataset({ checked })}>
      <label className={styles.label}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={checked}
          {...register}
          {...inputRestAttributes}
        />
        {label}
        <i className={`jam-icon jam-check ${styles.icon}`} aria-hidden="true" />
      </label>
    </div>
  )
}

export { Checkbox }
