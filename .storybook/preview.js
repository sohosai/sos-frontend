import "!style-loader!css-loader!normalize.css"
import "../src/styles/globals.scss"
import "./storybook.scss"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "centered",
  backgrounds: {
    default: "white",
    values: [
      {
        name: "gray-50",
        value: "#f5f4f6",
      },
      {
        name: "white",
        value: "white",
      },
    ],
  },
}
