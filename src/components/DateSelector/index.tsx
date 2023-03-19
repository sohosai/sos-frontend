import { FC } from "react"

import { MultipleFieldErrors, UseFormRegister } from "react-hook-form"

import { Dropdown } from ".."

import styles from "./index.module.scss"

declare namespace DateSelector {
  type Props = Readonly<{
    label?: string
    register?: UseFormRegister<any>
    registerOptions?: {
      month?: {
        name: string
        required?: boolean
      }
      day?: {
        name: string
        required?: boolean
      }
    }
    errorTypes?: {
      month?: MultipleFieldErrors
      day?: MultipleFieldErrors
    }
    dropdownProps?: {
      month?: Omit<Dropdown.Props, "options">
      day?: Omit<Dropdown.Props, "options">
    }
  }>
}

const DateSelector: FC<DateSelector.Props> = ({
  label,
  dropdownProps,
  register,
  registerOptions,
  errorTypes,
}) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
      <div className={styles.dropdownWrapper}>
        <div className={styles.dropdown}>
          <Dropdown
            options={[
              { value: "", label: "月" },
              ...Array.from({ length: 12 }, (_, index) => index + 1).map(
                (num) => ({
                  value: String(num),
                  label: String(num) + "月",
                })
              ),
            ]}
            {...dropdownProps?.month}
            required={registerOptions?.month?.required}
            register={
              register && registerOptions?.month?.name
                ? register(registerOptions?.month.name, {
                    required: registerOptions?.month.required,
                    valueAsNumber: true,
                    min: 1,
                    max: 12,
                  })
                : undefined
            }
            error={[
              errorTypes?.month?.required && "必須項目です",
              errorTypes?.month?.min && "不正な値です",
              errorTypes?.month?.max && "不正な値です",
            ]}
            bySide={true}
          />
        </div>
        <div className={styles.dropdown}>
          <Dropdown
            options={[
              { value: "", label: "日" },
              ...Array.from({ length: 31 }, (_, index) => index + 1).map(
                (num) => ({
                  value: String(num),
                  label: String(num) + "日",
                })
              ),
            ]}
            {...dropdownProps?.day}
            required={registerOptions?.day?.required}
            register={
              register && registerOptions?.day?.name
                ? register(registerOptions?.day.name, {
                    required: registerOptions?.day.required,
                    valueAsNumber: true,
                    min: 1,
                    max: 31,
                  })
                : undefined
            }
            error={[
              errorTypes?.day?.required && "必須項目です",
              errorTypes?.day?.min && "不正な値です",
              errorTypes?.day?.max && "不正な値です",
            ]}
            bySide={true}
          />
        </div>
      </div>
    </div>
  )
}

export { DateSelector }
