import { PropsWithChildren } from 'react';

import Header from '@/components/Header';

export default function MainLayout({ children }: PropsWithChildren) {
  return <>
    <div className="h-8 md:h-10 lg:h-12">
      <Header></Header>
    </div>
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-2.5rem)] lg:h-[calc(100vh-3rem)]">
      {children}
    </div>
  </>;
}
