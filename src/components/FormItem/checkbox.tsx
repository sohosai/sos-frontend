import { FC } from "react"

import { UseFormRegisterReturn } from "react-hook-form"

import styles from "./checkbox.module.scss"
import { Checkbox, Paragraph } from "src/components"
import { FormItem } from "src/types/models/form/item"

type Props = {
  formItem: Extract<FormItem, { type: "checkbox" }>
  checked: boolean[]
  registers: UseFormRegisterReturn[]
  error: "maxChecks" | "minChecks"
}

const CheckboxFormItem: FC<Props> = ({
  formItem,
  checked,
  registers,
  error,
}) => (
  <>
    <p className={styles.title}>{formItem.name}</p>
    {typeof formItem.boxes !== "string" &&
      formItem.boxes.map(({ id, label }, index) => (
        <div className={styles.checkboxWrapper} key={id}>
          <Checkbox
            label={label}
            checked={checked[index]}
            register={registers[index]}
          />
        </div>
      ))}
    {Boolean(formItem.description.length) && (
      <div className={styles.descriptions}>
        <Paragraph
          text={formItem.description}
          normalTextClassName={styles.description}
        />
      </div>
    )}
    <p className={styles.error}>
      {(() => {
        if (error === "maxChecks")
          return `最大${formItem.max_checks}つしか選択できません`
        if (error === "minChecks")
          return `最低${formItem.min_checks}つ選択してください`
      })()}
    </p>
  </>
)

export { CheckboxFormItem }
