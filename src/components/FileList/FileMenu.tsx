import { useMemo, useState, useRef, ChangeEvent, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { Upload, DeleteForever, Download, DriveFolderUpload/* , DriveFileMove */ } from '@mui/icons-material';

import { File } from './types';

import useTaskStore from '@/store/task.store';
import useFileStore from '@/store/file.store';
import FileDeleteDialog from './FileDeleteDialog';

interface Props {
  path: string;
  fileList: File[];
}

export default function FileMenu({ path, fileList }: Props) {
  const store = useTaskStore();
  const fileStore = useFileStore();
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const uploadFolderRef = useRef<HTMLInputElement | null>(null);
  const moreOptionsDisabled = useMemo(() => (fileList.filter((file) => file.selected).length === 0), [fileList]);
  const [ showDelete, setShowDelete ] = useState(false);

  useEffect(() => {
    if(uploadFolderRef.current) {
      uploadFolderRef.current.setAttribute('directory', '');
      uploadFolderRef.current.setAttribute('webkitdirectory', '');
      uploadFolderRef.current.setAttribute('mozdirectory', '');
    }
  }, []);

  function uploadFile(e: ChangeEvent<HTMLInputElement>) {
    if(!e.target.files) return;
    Array.from(e.target.files).forEach((file) => store.addUploadTask({ path }, file));
    e.target.value = '';
  }

  function downloadFiles() {
    const selectedFiles = fileList.filter((file) => file.selected);
    selectedFiles.forEach((file) => {
      const fileName = file.name.split('/').pop();
      if(!fileName) return;

      store.addDownloadTask({ path: fileStore.path }, fileName);
    });
  }

  return (<>
    <div className="h-13 text-right">
      <IconButton
        color="primary"
        sx={{ margin: '0.375rem 0' }}
        onClick={() => setShowDelete(() => true)}
        disabled={moreOptionsDisabled}
      >
        <DeleteForever></DeleteForever>
      </IconButton>
      <IconButton color="primary" sx={{ margin: '0.375rem 0' }} disabled={moreOptionsDisabled} onClick={downloadFiles}>
        <Download></Download>
      </IconButton>
      {/* <IconButton color="primary" sx={{ margin: '0.375rem 0' }} disabled={moreOptionsDisabled}>
        <DriveFileMove></DriveFileMove>
      </IconButton> */}
      <IconButton color="primary" sx={{ margin: '0.375rem 0' }} onClick={() => uploadRef.current?.click()}>
        <Upload></Upload>
        <input ref={uploadRef} className="hidden" type="file" multiple onChange={uploadFile}></input>
      </IconButton>
      <IconButton color="primary" sx={{ margin: '0.375rem 0' }} onClick={() => uploadFolderRef.current?.click()}>
        <DriveFolderUpload></DriveFolderUpload>
        <input ref={uploadFolderRef} className="hidden" type="file" multiple onChange={uploadFile}></input>
      </IconButton>
    </div>
    <FileDeleteDialog
      show={showDelete}
      onClose={() => setShowDelete(() => false)}
      target={fileList.filter((file) => file.selected)}
    ></FileDeleteDialog>
  </>);
}