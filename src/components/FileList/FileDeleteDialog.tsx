import { useState } from 'react';
import { Dialog, DialogTitle, Button, CircularProgress } from '@mui/material';
import { AxiosResponse } from 'axios';

import { File } from './types';
import { Response } from '@/api/types';

import FileAPI from '@/api/file';
import useFileStore from '@/store/file.store';

interface Props {
  show: boolean;
  onClose: () => void;
  target: File[];
}

export default function FileDeleteDialog({ show, onClose, target }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const store = useFileStore();

  function onDelete() {
    const promises: Promise<AxiosResponse<Response<unknown>>>[] = [];
    target.forEach((file) => {
      const fileName = file.name.split('/').pop();
      if(!fileName) return;

      promises.push(FileAPI.DeleteFile(store.path, fileName));
    });

    setIsLoading(() => true);
    Promise.all(promises)
      .then(() => {
        store.getFileList(store.path);
        onClose();
      })
      .finally(()=> setIsLoading(() => false));
  }

  return (
    <Dialog onClose={onClose} open={show}>
      <DialogTitle>
        <div className="flex flex-items-center">
          確定刪除檔案？
        </div>
      </DialogTitle>
      <div className="mb-4 px-4 max-h-80 text-deep-gray overflow-auto">
        { target.map((file) => file.name).join(', ') }
      </div>
      <div className="mx-4 mb-4 text-center">
        <div className="inline-block mx-2">
          <Button
            className="w-24"
            variant="contained"
            color="inherit"
            onClick={onClose}
          >
            取消
          </Button>
        </div>
        <div className="inline-block mx-2">
          <Button
            className="inline-block mx-1 w-24"
            variant="contained"
            color="error"
            startIcon={isLoading
              ? <CircularProgress size="0.75rem" sx={{ color: '#ddd' }}></CircularProgress>
              : null
            }
            onClick={onDelete}
          >
            刪除
          </Button>
        </div>
      </div>
    </Dialog>
  );
}