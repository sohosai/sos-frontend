import { FC } from "react"

import { MultipleFieldErrors, UseFormRegister } from "react-hook-form"

import { DateSelector, Dropdown, TimeSelector } from "../"

import styles from "./index.module.scss"

declare namespace DateTimeSelector {
  type Props = {
    label?: string
    register?: UseFormRegister<any>
    registerOptions?: {
      month: {
        name: string
        required?: boolean
      }
      day: {
        name: string
        required?: boolean
      }
      hour: {
        name: string
        required?: boolean
      }
      minute: {
        name: string
        required?: boolean
      }
    }
    errorTypes?: {
      month?: MultipleFieldErrors
      day?: MultipleFieldErrors
      hour?: MultipleFieldErrors
      minute?: MultipleFieldErrors
    }
    dropdownProps?: {
      month: Omit<Dropdown.Props, "options">
      day: Omit<Dropdown.Props, "options">
      hour: Omit<Dropdown.Props, "options">
      minute: Omit<Dropdown.Props, "options">
    }
  }
}

const DateTimeSelector: FC<DateTimeSelector.Props> = ({
  label,
  register,
  registerOptions,
  errorTypes,
  dropdownProps,
}) => (
  <>
    <p className={styles.label}>{label}</p>
    <div className={styles.selectorsWrapper}>
      <div className={styles.dateSelectorWrapper}>
        <DateSelector
          register={register}
          registerOptions={{
            month: registerOptions?.month,
            day: registerOptions?.day,
          }}
          errorTypes={{
            month: errorTypes?.month,
            day: errorTypes?.day,
          }}
          dropdownProps={{
            month: dropdownProps?.month,
            day: dropdownProps?.month,
          }}
        />
      </div>
      <div className={styles.timeSelectorWrapper}>
        <TimeSelector
          register={register}
          registerOptions={{
            hour: registerOptions?.hour,
            minute: registerOptions?.minute,
          }}
          errorTypes={{
            hour: errorTypes?.hour,
            minute: errorTypes?.minute,
          }}
          dropdownProps={{
            hour: dropdownProps?.hour,
            minute: dropdownProps?.minute,
          }}
        />
      </div>
    </div>
  </>
)

export { DateTimeSelector }
