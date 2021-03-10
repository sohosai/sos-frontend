import "next"

declare module "next" {
  export type PageOptions = {
    layout: "default"
  }

  export type PageFC<P = void, IP = P> = NextPage<P, IP> & PageOptions
}
