import { FC } from "react"

import styles from "./checkbox.module.scss"
import { Checkbox, Paragraph } from "src/components"
import { FormItem } from "src/types/models/form/item"

type Props = {
  formItem: Extract<FormItem, { type: "checkbox" }>
  checkedItemList: string[]
}

const AnsweredCheckboxFormItem: FC<Props> = ({ formItem, checkedItemList }) => (
  <>
    <p className={styles.title}>{formItem.name}</p>
    {typeof formItem.boxes !== "string" &&
      formItem.boxes.map(({ id, label }) => (
        <div className={styles.checkboxWrapper} key={id}>
          <Checkbox
            label={label}
            checked={checkedItemList.includes(id)}
            readOnly
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
  </>
)

export { AnsweredCheckboxFormItem }
