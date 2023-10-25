import {  createBrowserRouter } from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import HeaderLayout from './layout/HeaderLayout';

import Home from './views/Home';
import Login from './views/Login';

const baseURL = import.meta.env.PROD ? '/otter-cloud' : '';

export const routes = {
  home:  baseURL + '/',
  login: baseURL + '/login',
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
