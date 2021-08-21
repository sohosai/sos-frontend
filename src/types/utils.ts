export type PromiseType<T extends Promise<unknown>> = T extends Promise<infer U>
  ? U
  : never
