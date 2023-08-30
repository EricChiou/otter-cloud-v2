import { GetFileList } from '@/api/file/interface';
import { FileType } from '@/services/file.service';

export interface File extends GetFileList {
  readonly fileType: FileType;
  readonly canSelect: boolean;
  selected: boolean;
}
