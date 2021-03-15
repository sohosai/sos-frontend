import { FC } from "react"

declare namespace FormItemSpacer {
  type Props = {
    marginBottom?: string | number
  }
}

const FormItemSpacer: FC<FormItemSpacer.Props> = ({
  marginBottom = 32,
  children,
}) => {
  return (
    <div
      style={{
        marginBottom:
          typeof marginBottom === "number" ? `${marginBottom}px` : marginBottom,
      }}
    >
      {children}
    </div>
  )
}

export { FormItemSpacer }
