import { useState } from 'react';
import { Backdrop, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

import { File } from '../types';

import FileService, { FileType } from '@/services/file.service';
import VideoPreviewer from './VideoPreviewer';
import ImagePreviewer from './ImagePreviewer';

interface Props {
  onClose: () => void;
  path: string,
  target: File;
}

export default function FilePreviewer({ onClose, path, target }: Props) {
  const [fileType] = useState(FileService.GetFileType(target));

  return (
    <Backdrop className="z-1" open={true} onClick={onClose}>
      <div className="flex" onClick={(e) => e.stopPropagation()}>
        {(fileType === FileType.Video) && <VideoPreviewer path={path} target={target}></VideoPreviewer>}
        {(fileType === FileType.Image) && <ImagePreviewer path={path} target={target}></ImagePreviewer>}
      </div>
      <div className="fixed top-0 right-0">
        <IconButton>
          <Close className="text-white"></Close>
        </IconButton>
      </div>
    </Backdrop>
  );
}
