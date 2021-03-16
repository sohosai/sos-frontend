import type { PageFC } from "next"

const Index: PageFC = () => {
  console.log("CI test")
  return <></>
}
Index.layout = "default"

export default Index
