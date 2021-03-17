import "next"

import type { UserRole } from "./models/user"

declare module "next" {
  export type PageOptions = {
    layout: "default" | "empty"

    // Role-Based Page Access Control
    rbpac: Readonly<
      | { type: "public" }
      | { type: "enum"; role: UserRole[] }
      | { type: "higherThanIncluding"; role: UserRole }
      | { type: "lowerThanIncluding"; role: UserRole }
    >
  }

  export type PageFC<P = void, IP = P> = NextPage<P, IP> & PageOptions
}
