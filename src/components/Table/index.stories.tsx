import { Story } from "@storybook/react"
import { Table, Table as TableComponent } from "."
import { Icon } from "src/components"

export default {
  title: TableComponent.name,
  component: TableComponent,
}

export const Index: Story<
  Pick<Table.RowProps, "keyFlexGrow" | "valueFlexGrow">
> = ({ keyFlexGrow, valueFlexGrow }) => {
  return (
    <div
      style={{
        width: "500px",
      }}
    >
      <TableComponent>
        <Table.Row
          {...{ keyFlexGrow, valueFlexGrow }}
          keyElement="key as string"
          valueElement="value as string"
        />
        <Table.Row
          {...{ keyFlexGrow, valueFlexGrow }}
          keyElement={
            <p style={{ color: "red", fontWeight: "bold" }}>key as ReactNode</p>
          }
          valueElement={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Icon icon="sun" />
              <p>value as ReactNode</p>
              <Icon icon="mountain" />
            </div>
          }
        />
      </TableComponent>
    </div>
  )
}
Index.argTypes = {
  keyFlexGrow: {
    control: {
      type: "range",
      min: 1,
      max: 6,
    },
    defaultValue: 1,
  },
  valueFlexGrow: {
    control: {
      type: "range",
      min: 1,
      max: 6,
    },
    defaultValue: 2,
  },
}
