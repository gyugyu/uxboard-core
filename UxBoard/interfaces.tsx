export interface IIndex {
  name: string
  tasks?: Record<string, boolean>
}

export interface IDimension {
  name: string
  tasks?: Record<string, boolean>
}

export enum TaskStatus {
  Yet,
  Doing,
  Done
}
