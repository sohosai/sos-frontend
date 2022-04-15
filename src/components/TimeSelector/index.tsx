import { FC } from "react"

import { MultipleFieldErrors, UseFormRegister } from "react-hook-form"

import { Dropdown } from ".."

import styles from "./index.module.scss"

declare namespace TimeSelector {
  type Props = Readonly<{
    label?: string
    register?: UseFormRegister<any>
    registerOptions?: {
      hour?: {
        name: string
        required?: boolean
      }
      minute?: {
        name: string
        required?: boolean
      }
    }
    errorTypes?: {
      hour?: MultipleFieldErrors
      minute?: MultipleFieldErrors
    }
    dropdownProps?: {
      hour?: Omit<Dropdown.Props, "options">
      minute?: Omit<Dropdown.Props, "options">
    }
  }>
}

const TimeSelector: FC<TimeSelector.Props> = ({
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
              { value: "", label: "時" },
              ...Array.from({ length: 24 }, (_, index) => index).map((num) => ({
                value: String(num),
                label: String(num) + "時",
              })),
            ]}
            {...dropdownProps?.hour}
            required={registerOptions?.hour?.required}
            register={
              register && registerOptions?.hour?.name
                ? register(registerOptions?.hour.name, {
                    required: registerOptions?.hour.required,
                    valueAsNumber: true,
                    min: 0,
                    max: 23,
                  })
                : undefined
            }
            error={[
              errorTypes?.hour?.required && "必須項目です",
              errorTypes?.hour?.min && "不正な値です",
              errorTypes?.hour?.max && "不正な値です",
            ]}
            bySide={true}
          />
        </div>
        <div className={styles.dropdown}>
          <Dropdown
            options={[
              { value: "", label: "分" },
              ...Array.from({ length: 6 }, (_, index) => index).map((num) => ({
                value: String(num * 10),
                label: String(num * 10) + "分",
              })),
              { value: "59", label: "59分" },
            ]}
            {...dropdownProps?.minute}
            required={registerOptions?.minute?.required}
            register={
              register && registerOptions?.minute?.name
                ? register(registerOptions?.minute.name, {
                    required: registerOptions?.minute.required,
                    valueAsNumber: true,
                    min: 0,
                    max: 59,
                  })
                : undefined
            }
            error={[
              errorTypes?.minute?.required && "必須項目です",
              errorTypes?.minute?.min && "不正な値です",
              errorTypes?.minute?.max && "不正な値です",
            ]}
            bySide={true}
          />
        </div>
      </div>
    </div>
  )
}

export { TimeSelector }
