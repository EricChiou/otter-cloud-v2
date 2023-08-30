import { useState, ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { Cloud, KeyboardArrowRight, ExpandMore, Folder, FolderShared } from '@mui/icons-material';

import FileAPI from '@/api/file';

export default function SideMenu() {
  const search = useSearchParams();
  const [open, setOpen] = useState(true);
  const [openShared, setOpenShared] = useState(true);

  const { data } = useQuery({
    queryKey: ['sideMenu'],
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      const resp = await FileAPI.GetFileList('/');
      return resp.data;
    },
  });

  function renderFolderList() {
    const FolderList: ReactElement[] = [];
    data?.data
      .filter((data) =>  !data.contentType && data.size === 0)
      .forEach((data) => FolderList.push(
        <ListItemButton
          key={data.name}
          sx={{ paddingY: '0.25rem', paddingLeft: '2rem' }}
          onClick={() => search[1]({ path: '/' + data.name })}
        >
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText primary={data.name.slice(0, -1)} />
        </ListItemButton>,
      ));
    return FolderList;
  }

  return <>
    <List disablePadding>
      <ListItemButton
        sx={{ paddingY: '0.25rem', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        onClick={() => setOpen((value) => !value)}
      >
        <ListItemIcon>
          <Cloud />
        </ListItemIcon>
        <ListItemText primary={'我的雲端硬碟'} />
        {open ? <ExpandMore /> : <KeyboardArrowRight />}
      </ListItemButton>
      <Collapse in={open}>
        <List component="div" disablePadding>
          {renderFolderList()}
        </List>
      </Collapse>
    </List>
    <List disablePadding>
      <ListItemButton sx={{ paddingY: '0.25rem' }} onClick={() => setOpenShared((value) => !value)}>
        <ListItemIcon>
          <FolderShared />
        </ListItemIcon>
        <ListItemText primary={'共享資料夾'} />
        {openShared ? <ExpandMore /> : <KeyboardArrowRight />}
      </ListItemButton>
    </List>
  </>;
}
