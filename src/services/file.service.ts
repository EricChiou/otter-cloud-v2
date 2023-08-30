import { GetFileList } from '@/api/file/interface';

interface FileConfig {
  contentType: string[];
  fileType: FileType;
}

export enum FileType { Folder, File, Text, Image, Audio, Video, ZIP, PDF, Word, Excel, PPT }

export default class FileService {
  private static readonly FileConfig: FileConfig[] = [
    {
      contentType: ['octet-stream'],
      fileType: FileType.File,
    },
    {
      contentType: ['text'],
      fileType: FileType.Text,
    },
    {
      contentType: ['image'],
      fileType: FileType.Image,
    },
    {
      contentType: ['audio'],
      fileType: FileType.Audio,
    },
    {
      contentType: ['video'],
      fileType: FileType.Video,
    },
    {
      contentType: ['zip'],
      fileType: FileType.ZIP,
    },
    {
      contentType: ['pdf'],
      fileType: FileType.PDF,
    },
    {
      contentType: ['vnd.openxmlformats-officedocument.wordprocessingml.document'],
      fileType: FileType.Word,
    },
    {
      contentType: [
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      fileType: FileType.Excel,
    },
    {
      contentType: ['vnd.openxmlformats-officedocument.presentationml.presentation'],
      fileType: FileType.PPT,
    },
  ];

  public static GetFileType(file: GetFileList): FileType {
    if (file.size === 0 && !file.contentType) return FileType.Folder;
    for(const fileConfig of this.FileConfig) {
      for(const contentType of fileConfig.contentType) {
        if(file.contentType.indexOf(contentType) > -1) {
          return fileConfig.fileType;
        }
      }
    }
    return FileType.File;
  }
}
