import type { NextPage } from "next"

import type { PageUserRole } from "./models/user/userRole"

declare module "next" {
  export type PageOptions = {
    layout: "default" | "committee" | "empty"

    // Role-Based Page Access Control
    rbpac: Readonly<
      | { type: "public" }
      | { type: "enum"; role: PageUserRole[] }
      | { type: "higherThanIncluding"; role: PageUserRole }
      | { type: "lowerThanIncluding"; role: PageUserRole }
    >
  }

  export type PageFC<P = void, IP = P> = NextPage<P, IP> & PageOptions
}
