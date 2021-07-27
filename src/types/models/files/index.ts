import { FormId } from "../form"
import type { ProjectId } from "../project"
import type { UserId } from "../user"

export type FileId = string

export type Mime = string

export type FileDistributionId = string

export type FileSharingId = string

export type File = Readonly<{
  id: FileId
  created_at: number
  author_id: UserId
  blake3_digest: string
  name?: string
  type: Mime
  size: number
}>

export type FileDistribution = Readonly<{
  id: FileDistributionId
  created_at: number
  author_id: UserId
  name: string
  description: string
  files: Array<{
    project_id: ProjectId
    sharing_id: FileSharingId
  }>
}>

export type DistributedFile = Readonly<{
  distribution_id: string
  distributed_at: number
  name: string
  description: string
  project_id: string
  sharing_id: string
}>

export type FileSharingScope =
  | Readonly<{
      type: "project"
      id: ProjectId
    }>
  | Readonly<{
      type: "form_answer"
      project_id: ProjectId
      form_id: FormId
    }>
  | Readonly<{
      type: "committee" | "committee_operator" | "public"
    }>

export type FileSharing = Readonly<{
  id: FileSharingId
  created_at: number
  is_revoked: boolean
  expires_at?: number
  scope: FileSharingScope
  file_id: FileId
  file_name?: string
  file_type: Mime
  file_size: number
}>
