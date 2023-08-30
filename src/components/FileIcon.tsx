import { useMemo } from 'react';
import {
  Folder,
  /* FolderShared, */
  File,
  FileZIP,
  FileExcel,
  FileAudio,
  FileImage,
  FilePDF,
  FilePPT,
  FileText,
  FileVideo,
  FileWord,
} from '@/components/icons';

import { GetFileList } from '@/api/file/interface';
import FileService, { FileType } from '@/services/file.service';


interface Props {
  file: GetFileList;
}

export default function FileIcon({ file }: Props) {
  const className = 'w-4.5 h-4.5 text-deep-gray';
  const fileType = useMemo(() => FileService.GetFileType(file), [file]);

  switch (fileType) {
    case FileType.Folder:
      return <Folder className={className}></Folder>;
    case FileType.Text:
      return <FileText className={className}></FileText>;
    case FileType.Image:
      return <FileImage className={className}></FileImage>;
    case FileType.Audio:
      return <FileAudio className={className}></FileAudio>;
    case FileType.Video:
      return <FileVideo className={className}></FileVideo>;
    case FileType.ZIP:
      return <FileZIP className={className}></FileZIP>;
    case FileType.PDF:
      return <FilePDF className={className}></FilePDF>;
    case FileType.Word:
      return <FileWord className={className}></FileWord>;
    case FileType.Excel:
      return <FileExcel className={className}></FileExcel>;
    case FileType.PPT:
      return <FilePPT className={className}></FilePPT>;
  }
  return <File className={className}></File>;
}