import {  createBrowserRouter } from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import HeaderLayout from './layout/HeaderLayout';

import Home from './views/Home';
import Login from './views/Login';

export const routes = {
  home: '/',
  login: '/login',
};

const router = createBrowserRouter([
  {
    path: routes.login,
    element: <>
      <HeaderLayout>
        <Login></Login>
      </HeaderLayout>
    </>,
  },
  {
    path: routes.home,
    element: <>
      <MainLayout>
        <Home></Home>
      </MainLayout>
    </>,
  },
]);

export default router;
