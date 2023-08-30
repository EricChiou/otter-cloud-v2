import { useState, useRef, useEffect, useCallback } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import logo from '@/assets/img/logo.png';

import { MD, LG } from '@/constants/breakpoints';
import useUserStore from '@/store/user.store';

export default function Header() {
  const userStore = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [ buttonSize, setButtonSize ] = useState({ width: '40px', height: '40px' });

  const onResize = useCallback(() => {
    if(window.innerWidth < MD) {
      setButtonSize(() => ({ width: '21px', height: '21px' }));
    } else if (window.innerWidth < LG) {
      setButtonSize(() => ({ width: '32px', height: '32px' }));
    } else {
      setButtonSize(() => ({ width: '40px', height: '40px' }));
    }
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => (window.removeEventListener('resize', onResize));
  }, [onResize]);

  return (
    <div className="flex p-1 h-[calc(100%-0.5rem)] bg-blue text-white">
      <div className="flex-auto">
        <img className="mr-2 h-full align-mid" src={logo}></img>
        <span className="text-sm md:text-base lg:text-3xl font-bold align-mid">Otter Cloud</span>
      </div>
      <div className="flex-col">
        <div className="hidden md:block md:my-1.25 lg:my-2">{userStore.user.name}</div>
      </div>
      <div className="flex-col">
        <div ref={menuRef}>
          <IconButton aria-label="menu" color="inherit" sx={buttonSize} onClick={() => setMenuOpen(() => true)}>
            <MenuIcon></MenuIcon>
          </IconButton>
        </div>
        <Menu anchorEl={menuRef.current} open={menuOpen} onClose={() => setMenuOpen(() => false)}>
          <MenuItem></MenuItem>
        </Menu>
      </div>
    </div>
  );
}
