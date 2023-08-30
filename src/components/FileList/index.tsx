import { useEffect, useState, useMemo, ChangeEvent, useRef, KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs, Link } from '@mui/material';
import { Checkbox, IconButton, InputBase } from '@mui/material';
import { CreateNewFolder, Search, ArrowUpward, ArrowDownward } from '@mui/icons-material';

import { File } from './types';

import { FileType } from '@/services/file.service';
import FileComponent from './FileComponent';
import FileMenu from './FileMenu';
import TaskList from '@/components/TaskList';
import useFileStore from '@/store/file.store';

enum OrderDirection {
  Desc,
  Asc,
}

interface Order {
  id: OrderID | null;
  direction: OrderDirection;
}

enum OrderID {
  Name = 'name',
  LastModified = 'lastModified',
}

export default function FileList() {
  const [search, setSearch] = useSearchParams();
  const store = useFileStore();
  const path = useMemo(() => search.get('path') || '/', [search]);
  const breadcrumbs = useMemo(() => {
    const result: string[] = [];
    path.split('/').filter((folderName) => folderName).forEach((folderName, i) => {
      result.push(`${result[i-1] || '' }/${folderName}`);
    });
    return result;
  }, [path]);
  const [headCheckBox, setHeadCheckBox] = useState<{ checked: boolean, indeterminate: boolean }>({
    checked: false,
    indeterminate: false,
  });
  const [fileList, setFileList] = useState<File[]>([]);
  const [order, setOrder] = useState<Order>({ id: null, direction: OrderDirection.Desc });
  const tableMaxHeight = useMemo(() => window.innerHeight - 188, [window.innerHeight]);
  const keyword = useRef('');

  useEffect(() => {
    setFileList(() => []);
    store.getFileList(path);
  }, [path]);

  useEffect(() => { setFileList(() => store.list); }, [store.list]);

  useEffect(() => {
    const canSelectedCount = fileList.reduce((value, data) => (data.canSelect ? (value + 1) : value), 0);
    const selectedCount = fileList.reduce((value, data) => (data.selected ? (value + 1) : value), 0);
    if (selectedCount > 0 && selectedCount < canSelectedCount) {
      setHeadCheckBox(() => ({ checked: false, indeterminate: true }));
    } else if (selectedCount > 0 && selectedCount === canSelectedCount) {
      setHeadCheckBox(() => ({ checked: true, indeterminate: false }));
    } else {
      setHeadCheckBox(() => ({ checked: false, indeterminate: false }));
    }
  }, [fileList]);

  function fileOnClick(file: File, index: number) {
    file.fileType === FileType.Folder
      ? setSearch({ path: '/' + file.name })
      : setFileList((value) => {
          const newValue = [...value];
          newValue[index] = { ...value[index], selected: !value[index].selected };
          return newValue;
        });
  }

  function sort(orderID: OrderID, changeDirection = true) {
    if(!changeDirection) {
      setFileList((value) => {
        const newValue = [...value];
        return newValue.sort((a, b) => (a[orderID] > b[orderID]) ? -1 : 1);
      });
      return;
    }

    if (order.id === orderID && order.direction !== OrderDirection.Asc) {
      setOrder(() => ({ id: orderID, direction: OrderDirection.Asc }));
      setFileList((value) => {
        const newValue = [...value];
        return newValue.sort((a, b) => (a[orderID] > b[orderID]) ? -1 : 1);
      });
    } else {
      setOrder(() => ({ id: orderID, direction: OrderDirection.Desc }));
      setFileList((value) => {
        const newValue = [...value];
        return newValue.sort((a, b) => (a[orderID] > b[orderID]) ? 1 : -1);
      });
    }
  }

  function filterKeyword() {
    setFileList(() => {
      const newValue = keyword.current
        ? [...store.list].filter((file) => file.name.indexOf(keyword.current) > -1)
        : [...store.list];
      return newValue;
    });
    order.id && sort(order.id, false);
  }

  return (
    <div className="relative">
      <div className="px-3 py-2 border-b border-b-solid border-gray">
        <Breadcrumbs>
          <Link
            className="text-blue cursor-pointer"
            underline="hover"
            onClick={() => setSearch({ path: '/' })}
          >
            我的雲端硬碟
          </Link>
          {
            breadcrumbs.map((breadcrumb) => (
              <Link
                key={breadcrumb}
                className="text-blue cursor-pointer"
                underline="hover"
                onClick={() => setSearch({ path: breadcrumb + '/' })}
              >
                { breadcrumb.split('/').pop() }
              </Link>
            ))
          }
          <IconButton sx={{ padding: 0, borderRadius: '0.125rem' }}>
            <CreateNewFolder className="text-blue"></CreateNewFolder>
          </IconButton>
        </Breadcrumbs>
      </div>
      <div className="flex items-center px-0.5 border-b border-b-solid border-gray">
        <div className="flex-col w-12">
          <Checkbox
            checked={headCheckBox.checked}
            indeterminate={headCheckBox.indeterminate}
            onChange={() => {
              if (headCheckBox.checked) {
                setHeadCheckBox(() => ({ checked: false, indeterminate: false }));
                setFileList((value) => {
                const newValue = [...value];
                  newValue.forEach((v) => v.canSelect && (v.selected = false));
                  return newValue;
                });
              } else {
                setHeadCheckBox(() => ({ checked: true, indeterminate: false }));
                setFileList((value) => {
                  const newValue = [...value];
                  newValue.forEach((v) => v.canSelect && (v.selected = true));
                  return newValue;
                });
              }
            }}
          ></Checkbox>
        </div>
        <div className="flex-col ml-0.5 w-[calc(100%-26rem)]">
          <span className="cursor-pointer" onClick={() => sort(OrderID.Name)}>
            <span className="align-middle">檔案名稱</span>
            { order.id !== OrderID.Name && <ArrowDownward className="text-light-gray align-middle"></ArrowDownward> }
            { order.id === OrderID.Name && (
              order.direction === OrderDirection.Desc
                ? <ArrowDownward className="text-deep-gray align-middle"></ArrowDownward>
                : <ArrowUpward className="text-deep-gray align-middle"></ArrowUpward>
            )}
          </span>
          <span className="inline-block px-0.5 border border-solid border-gray rounded">
            <InputBase
              className="align-middle"
              placeholder="搜尋"
              onChange={(e: ChangeEvent<HTMLInputElement>) => keyword.current = e.target.value}
              onKeyUp={(e: KeyboardEvent<HTMLInputElement>) =>
                (e.code === 'Enter' || e.code === 'NumpadEnter') && filterKeyword()
              }
            ></InputBase>
            <IconButton size="small" onClick={filterKeyword}>
              <Search></Search>
            </IconButton>
          </span>
        </div>
        <div className="flex-col ml-0.5 w-32">檔案大小</div>
        <div className="flex-col ml-0.5 w-36">
          <span className="cursor-pointer" onClick={() => sort(OrderID.LastModified)}>
            <span className="align-middle">最後修改日期</span>
            { order.id !== OrderID.LastModified
              && <ArrowDownward className="text-light-gray align-middle"></ArrowDownward>
            }
            { order.id === OrderID.LastModified && (
                order.direction === OrderDirection.Desc
                  ? <ArrowDownward className="text-deep-gray align-middle"></ArrowDownward>
                  : <ArrowUpward className="text-deep-gray align-middle"></ArrowUpward>
            )}
          </span>
        </div>
        <div className="flex-col ml-0.5 w-20"></div>
      </div>
      <div className={'overflow-y-auto border-b border-b-solid border-gray'} style={{ height: tableMaxHeight }}>
        {fileList.map((file, i) =>
          <FileComponent key={file.name} path={path} file={file} onClick={() => fileOnClick(file, i)}></FileComponent>,
        )}
      </div>
      <FileMenu path={path} fileList={fileList}></FileMenu>
      <div className="absolute left-0 bottom-0">
        <TaskList></TaskList>
      </div>
    </div>
  );
}