import { Story } from "@storybook/react"

import { PageError } from "."

export default {
  title: PageError.name,
  component: PageError,
}

export const Index: Story<
  Omit<PageError.Props, "messages"> & { messages: string }
> = ({ statusCode, StatusCodeTagName, messages }) => (
  <PageError
    statusCode={statusCode}
    StatusCodeTagName={StatusCodeTagName}
    messages={messages.split(",")}
  />
)
Index.argTypes = {
  statusCode: {
    control: {
      type: "radio",
      options: [404, 500],
    },
    defaultValue: 404,
  },
  messages: {
    control: { type: "text" },
    defaultValue: "お探しのページが見つかりませんでした",
  },
}
