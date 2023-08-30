import {  createBrowserRouter } from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import EmptyLayout from './layout/EmptyLayout';

import Home from './views/Home';
import Login from './views/Login';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <>
      <EmptyLayout>
        <Login></Login>
      </EmptyLayout>
    </>,
  },
  {
    path: '/',
    element: <>
      <MainLayout>
        <Home></Home>
      </MainLayout>
    </>,
  },
]);

export default router;
