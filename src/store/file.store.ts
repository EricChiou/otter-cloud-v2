import { create } from 'zustand';

import { GetFileList } from '@/api/file/interface';
import FileService, { FileType } from '@/services/file.service';

import FileAPI from '@/api/file';

export interface File extends GetFileList {
  readonly fileType: FileType;
  readonly canSelect: boolean;
  selected: boolean;
}

interface FileState {
  isLoading: boolean;
  path: string;
  list: File[];
}

interface FileAction {
  getFileList: (path: string) => void;
}

const initialState: FileState = {
  isLoading: false,
  path: '/',
  list: [],
};

const useFileStore = create<FileState & FileAction>((set) => ({
  ...initialState,
  getFileList: async (path: string) => {
    set({ isLoading: true, path });
    const resp = await FileAPI.GetFileList(path);
    const list = resp.data.data.map((file) => ({
      ...file,
      fileType: FileService.GetFileType(file),
      canSelect: !!(file.contentType && file.size),
      selected: false,
    }));
    set({ isLoading: false, list });
  },
}));

export default useFileStore;
