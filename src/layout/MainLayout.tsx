import { PropsWithChildren } from 'react';

import Header from '@/components/Header';
import SideMenu from '@/components/SideMenu';

export default function MainLayout({ children }: PropsWithChildren) {
  return <>
    <div className="h-8 md:h-10 lg:h-12">
      <Header></Header>
    </div>
    <div className="flex h-[calc(100vh-3rem)]">
      <div className="flex-col w-64 shadow-[1px_0_0_0_#ddd]">
        <SideMenu></SideMenu>
      </div>
      <div className="flex-col w-[calc(100%-16rem)]">
        {children}
      </div>
    </div>
  </>;
}
