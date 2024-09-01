import { Task } from "./Task";
import { TaskGroup } from "./TaskGroup";

export enum TaskProblemCode {
  TASK_NUMBER_ERROR = 'TASK_NUMBER_ERROR',
  TASK_DESCRIPTION_TEXT_ENDING = 'TASK_NUMBER_ERROR',
  TASK_DESCRIPTION_CONTAINS_SPECS_OR_NOTE = 'TASK_NUMBER_ERROR',
  DUPLICATE_TASK_ID = 'TASK_NUMBER_ERROR',
  EMPTY_TASK = 'TASK_NUMBER_ERROR',
  NOT_EXIST_DISABLED_TASK_KEY = 'TASK_NUMBER_ERROR'
}

export interface TaskProblem {
  code: TaskProblemCode,
  msg: string;
}

export interface TaskWithProblem extends Task {
  problems: TaskProblem[];
}

export interface TaskGroupWithProblem extends Omit<TaskGroup, "task"> {
  task: TaskWithProblem[];
  problems: TaskProblem[];
}
