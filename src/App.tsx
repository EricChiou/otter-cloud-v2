import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';

import Router from '@/router';
import Theme from '@/theme';
import useUserStore from '@/store/user.store';
import UserService from '@/services/user.service';

const queryClient = new QueryClient();

export default function App() {
  const userStore = useUserStore();

  useEffect(() => {
    userStore.setUser(UserService.GetProfile());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={Router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
