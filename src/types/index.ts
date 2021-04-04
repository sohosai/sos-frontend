import "next"

import type { UserRole } from "./models/user"

export type PageUserRole = UserRole | "guest"

declare module "next" {
  export type PageOptions = {
    layout: "default" | "empty"

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
