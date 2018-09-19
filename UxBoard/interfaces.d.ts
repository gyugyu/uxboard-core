export interface IIndex {
    name: string;
    tasks?: Record<string, boolean>;
}
export interface IDimension {
    name: string;
    tasks?: Record<string, boolean>;
}
export declare enum TaskStatus {
    Yet = 0,
    Doing = 1,
    Done = 2
}
