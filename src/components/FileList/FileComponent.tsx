import { MouseEvent, useState, useRef, useMemo } from 'react';
import { Checkbox, IconButton } from '@mui/material';
import { Menu, MenuItem, PopoverReference } from '@mui/material';
import { Download, MoreVert, Preview, Delete } from '@mui/icons-material';

import { File } from './types';

import FileIcon from '@/components/FileIcon';
import FileService, { FileType } from '@/services/file.service';
import FileDeleteDialog from './FileDeleteDialog';
import FilePreviewer from './FilePreviewer';
import useTaskStore from '@/store/task.store';
import useFileStore from '@/store/file.store';

interface Props {
  path: string;
  file: File;
  onClick: () => void;
}

export default function FileComponent({ path, file, onClick }: Props) {
  const store = useTaskStore();
  const fileStore = useFileStore();
  const fileType = useMemo(() => FileService.GetFileType(file), [file]);
  const fileName = useMemo(() => {
    return file.fileType === FileType.Folder
      ? file.name.replace(path.substring(1), '').slice(0, -1)
      : file.name.replace(path.substring(1), '');
  }, [file]);
  const [ anchorReference, setAnchorReference ] = useState<PopoverReference>('anchorEl');
  const [ open, setOpen ] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [ showPreview, setShowPreview ] = useState(false);
  const [ showDelete, setShowDelete ] = useState(false);

  function openMenu(e: MouseEvent) {
    e.stopPropagation();
    setAnchorReference('anchorEl');
    setOpen(() => true);
  }

  function onContextMenu(e: MouseEvent) {
    e.preventDefault();
    setAnchorReference('anchorPosition');
    setContextMenu(() => ({ x: e.clientX, y: e.clientY }));
  }

  function onClose(e?: MouseEvent) {
    e?.preventDefault();
    setOpen(() => false);
    setContextMenu(() => null);
  }

  function download() {
    const fileName = file.name.split('/').pop();
    if(!fileName) return;

    store.addDownloadTask({ path: fileStore.path }, fileName);
  }

  function preview() {
    onClose();
    setShowPreview(() => true);
  }

  function onDelete() {
    onClose();
    setShowDelete(() => true);
  }

  function renderFileSize(size: number) {
    // TB
    if(size > 1099511627776) {
      return `${(size / 1099511627776).toFixed(2)} TB`;
    }
    // GB
    if(size > 1073741824) {
      return `${(size / 1073741824).toFixed(2)} GB`;
    }
    // MB
    if(size > 1048576) {
      return `${(size / 1048576).toFixed(2)} MB`;
    }
    // KB
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return (<>
    <div
      className="flex items-center px-0.5 border-b border-b-solid border-gray cursor-pointer hover:bg-light-gray"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="flex-col w-12 h-[42px]">
        {file.canSelect && <Checkbox checked={file.selected}></Checkbox>}
      </div>
      <div className="flex-col ml-0.5 w-[calc(100%-26rem)]">
        <div className="flex items-center">
          <div className="flex-col mr-0.5 h-4.5 text-deep-gray">
            <FileIcon file={file}></FileIcon>
          </div>
          <div className="flex-col truncate">{fileName}</div>
        </div>
      </div>
      <div className="flex-col ml-0.5 pl-1 w-31 text-sm">
        {renderFileSize(file.size)}
      </div>
      <div className="flex-col ml-0.5 pl-1 w-35 text-sm">
        {file.lastModified.substring(0, 16).replace('T', ' ')}
      </div>
      <div className="flex-col ml-0.5 w-20">
        <IconButton onClick={(e: MouseEvent) => { e.stopPropagation(); download(); }}>
          <Download></Download>
        </IconButton>
        <IconButton ref={menuRef} onClick={openMenu}>
          <MoreVert></MoreVert>
        </IconButton>
      </div>
    </div>
    <Menu
      open={!!(open || contextMenu)}
      onClose={() => onClose()}
      anchorReference={anchorReference}
      anchorEl={menuRef.current}
      anchorPosition={contextMenu ? { left: contextMenu.x, top: contextMenu.y } : undefined}
      onContextMenu={onClose}
    >
      {fileType !== FileType.Folder && (
        <MenuItem onClick={preview}>
          <Preview className="text-deep-gray"></Preview> 預覽
        </MenuItem>
      )}
      <MenuItem onClick={onDelete}>
        <Delete className="text-deep-gray"></Delete> 刪除
      </MenuItem>
    </Menu>
    {showPreview && (
      <FilePreviewer onClose={() => setShowPreview(() => false)} path={path} target={file}></FilePreviewer>
    )}
    <FileDeleteDialog show={showDelete} onClose={() => setShowDelete(() => false)} target={[file]}></FileDeleteDialog>
  </>);
}
