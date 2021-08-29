import { FC } from "react"
import { Tooltip, IconButton } from "src/components"

declare namespace CopyButton {
  type Props = {
    string: string
    size?: IconButton.Props["size"]
    tooltipText?: string
    className?: string
    onCopied?: () => void
  }
}

const CopyButton: FC<CopyButton.Props> = ({
  string,
  size,
  tooltipText = "クリップボードにコピー",
  className = "",
  onCopied,
}) => (
  <div className={className}>
    <Tooltip title={tooltipText}>
      <div>
        <IconButton
          size={size}
          icon="clipboard"
          onClick={async () => {
            await navigator.clipboard.writeText(string)
            onCopied && onCopied()
          }}
        />
      </div>
    </Tooltip>
  </div>
)

export { CopyButton }
