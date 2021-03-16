import "next"

declare module "next" {
  export type PageOptions = {
    layout: "default" | "empty"
  }

  export type PageFC<P = void, IP = P> = NextPage<P, IP> & PageOptions
}
