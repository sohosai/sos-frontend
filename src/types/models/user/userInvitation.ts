import type { UserRole } from "./userRole"
import { UserId } from "."

export type UserInvitation = Readonly<{
  id: UserInvitationId
  created_at: Date
  author_id: UserId
  email: string
  role: UserRole
}>

export type UserInvitationId = string
