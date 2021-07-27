import { Tooltip as MaterialUiTooltip, TooltipProps } from "@material-ui/core"
import { StylesProvider } from "@material-ui/core/styles"
import { FC, ReactNode } from "react"

import styles from "./index.module.scss"

declare namespace Tooltip {
  type Props = {
    title: string
    id?: string
    placement?: TooltipProps["placement"]
    children: ReactNode
  } & TooltipProps
}

/**
 * @param children React component を直接渡す場合は多分 div で囲う必要あり
 */
const Tooltip: FC<Tooltip.Props> = ({
  id,
  title,
  placement = "top",
  children,
  ...rest
}) => (
  <StylesProvider injectFirst>
    <MaterialUiTooltip
      id={id}
      title={title}
      placement={placement}
      classes={{
        tooltip: styles.tooltip,
      }}
      {...rest}
    >
      {children}
    </MaterialUiTooltip>
  </StylesProvider>
)

export { Tooltip }
