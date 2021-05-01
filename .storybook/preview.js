import "!style-loader!css-loader!normalize.css"
import "../src/styles/globals.scss"
import "./storybook.scss"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "centered",
}
