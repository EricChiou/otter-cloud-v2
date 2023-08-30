import axios, { CancelTokenSource } from 'axios';
import { create } from 'zustand';

export interface Prefix {
  sharedID?: number;
  path: string;
}

export enum TaskStatus {
  Running,
  Error,
}

export enum TaskType {
  Upload,
  Download,
}

export interface Task {
  id: number;
  type: TaskType;
  status: TaskStatus;
  cancelToken: CancelTokenSource;
  prefix: Prefix;
  fileName?: string;
  file?: File;
}

interface TaskState {
  list: Task[];
}

interface TaskAction {
  addUploadTask: (prefix: Prefix, file: File) => void;
  addDownloadTask: (prefix: Prefix, fileName: string) => void;
  deleteTask: (id: number) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
}

const initialState: TaskState = {
  list: [],
};

const useTaskStore = create<TaskState & TaskAction>((set) => ({
  ...initialState,
  addUploadTask: (prefix: Prefix, file: File) => {
    set(({ list }) => {
      const task: Task = {
        id: (list[list.length - 1]?.id + 1) || new Date().getTime(),
        type: TaskType.Upload,
        status: TaskStatus.Running,
        cancelToken: axios.CancelToken.source(),
        prefix,
        file,
      };
      return { list: [...list, task] };
    });
  },
  addDownloadTask: (prefix: Prefix, fileName: string) => {
    set(({ list }) => {
      const task: Task = {
        id: (list[list.length - 1]?.id + 1) || new Date().getTime(),
        type: TaskType.Download,
        status: TaskStatus.Running,
        cancelToken: axios.CancelToken.source(),
        prefix,
        fileName,
      };
      return { list: [...list, task] };
    });
  },
  updateTask: (id: number, task: Partial<Task>) => {
    set(({ list }) => {
      const result = [...list];
      const index = result.findIndex((t) => t.id === id);
      (index > -1) && (result[index] = { ...result[index], ...task });
      return { list: result };
    });
  },
  deleteTask: (id: number) => {
    set(({ list }) => {
      const result = [...list];
      const index = result.findIndex((t) => t.id === id);
      if(index > -1) {
        list[index].cancelToken.cancel();
        result.splice(index, 1);
      }
      return { list: result };
    });
  },
}));

export default useTaskStore;
