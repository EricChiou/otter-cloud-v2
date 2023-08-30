import { useEffect, useState, useRef, useCallback } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { CircularProgress } from '@mui/material';
import { Upload, Download, Error, Close, Refresh } from '@mui/icons-material';

import useTaskStore from '@/store/task.store';
import { Task, TaskType, TaskStatus } from '@/store/task.store';
import FileAPI from '@/api/file';
import useFileStore from '@/store/file.store';

interface Props {
  task: Task;
  removeTask: (id: number) => void;
  index: number;
  maxRunTaskNum: number;
}

export default function TaskComponent({ task, removeTask, index, maxRunTaskNum }: Props) {
  const [ showOtherOption, setShowOtherOption ] = useState(false);
  const store = useTaskStore();
  const fileStore = useFileStore();
  const loading = useRef(false);
  const cancelToken = useRef(axios.CancelToken.source());
  const [ progess, setProgess ] = useState(0);

  useEffect(() => {
    if(index <= maxRunTaskNum) doTask();
  }, [index]);

  const progressCallback = useCallback((event: AxiosProgressEvent) => {
    setProgess(() => {
      if (event.progress === undefined) return 0;
      return Math.round(event.progress * 100);
    });
  }, []);

  function doTask() {
    if(loading.current) return;
    loading.current = true;
    setProgess(() => 0);
    store.updateTask(task.id, { status: TaskStatus.Running });
    switch (task.type) {
      case TaskType.Upload:
        if(!task.file) return;
        FileAPI.UploadFile(task.prefix, task.file, progressCallback, cancelToken.current.token)
          .then(() => {
            fileStore.getFileList(fileStore.path);
            removeTask(task.id);
          })
          .catch(() => store.updateTask(task.id, { status: TaskStatus.Error }))
          .finally(() => loading.current = false);
        break;
      case TaskType.Download:
        if(!task.fileName) return;
        FileAPI.DownloadFile(task.prefix, task.fileName, progressCallback, cancelToken.current.token)
          .then((resp) => {
            const url = URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = task.fileName!;
            link.style.display = 'none';
            link.click();
            URL.revokeObjectURL(url);
            removeTask(task.id);
          })
          .catch(() => store.updateTask(task.id, { status: TaskStatus.Error }))
          .finally(() => loading.current = false);
        break;
    }
  }

  return (
    <div
      className="flex items-center px-1 py-0.5 bg-white border-b border-b-solid border-gray"
      onMouseMove={() => setShowOtherOption(() => true)}
      onMouseLeave={() => setShowOtherOption(() => false)}
    >
      <div className="flex-col relative h-6">
      {showOtherOption
        ? <Close sx={{ cursor: 'pointer' }} onClick={() => removeTask(task.id)}></Close>
        : task.type === TaskType.Upload ? <Upload></Upload> : <Download></Download>
      }
      </div>
      <div className="flex-col w-64 truncate">
        {task.file?.name || task.fileName}
      </div>
      <div className="flex-col relative h-6">
        {(showOtherOption && task.status === TaskStatus.Error)
          ? <Refresh sx={{ cursor: 'pointer' }} onClick={doTask}></Refresh>
          : task.status === TaskStatus.Running
            ? <>
                <CircularProgress variant="determinate" size={24} value={progess}></CircularProgress>
                <div className="absolute top-1 w-full text-center text-xs scale-90">{progess}%</div>
              </>
            : <Error sx={{ color: 'red' }}></Error>
        }
      </div>
    </div>
  );
}
