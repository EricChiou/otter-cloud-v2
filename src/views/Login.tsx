import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { routes } from '@/router';
import useUserStore from '@/store/user.store';

export default function Login() {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const [ isSignUp, setIsSignUp ] = useState(false);
  const [ loginData, setLoginData ] = useState({
    acc: '',
    pwd: '',
  });
  const [ signUpData, setSignUpData ] = useState({
    account: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    userStore.user.name && navigate(routes.home);
  }, []);

  useEffect(() => {
    setLoginData(() => ({ acc: '', pwd: '' }));
    setSignUpData(() => ({ account: '', password: '', confirmPassword: '' }));
  }, [isSignUp]);

  function login() {
    if(!loginData.acc || !loginData.pwd) return;
    userStore.login(loginData.acc, loginData.pwd);
  }

  function renderLogin() {
    return <>
      <div className="mt-4 text-center">
        <span>ACC：</span>
        <input
          className="input w-48"
          value={loginData.acc}
          onChange={(e) => setLoginData((value) => ({ ...value, acc: e.target.value }))}
        ></input>
      </div>
      <div className="mt-4 text-center">
        <span>PWD：</span>
        <input
          className="input w-48"
          type="password"
          value={loginData.pwd}
          onChange={(e) => setLoginData((value) => ({ ...value, pwd: e.target.value }))}
        ></input>
      </div>
      <div className="my-4 text-center">
        <button className="button text-white bg-blue" onClick={login}>Log in</button>
      </div>
      <div
        className="absolute right-1 bottom-0.5 text-sm text-blue hover:decoration-underline cursor-pointer"
        onClick={() => setIsSignUp(() => true)}
      >
        sign up
      </div>
    </>;
  }

  function renderSignUp() {
    return <>
      <div className="mt-4 mx-2">
        <div>Account</div>
        <input
          className="input w-[calc(100%-0.375rem)]"
          value={signUpData.account}
          onChange={(e) => setSignUpData((value) => ({ ...value, account: e.target.value }))}
        ></input>
      </div>
      <div className="mt-4 mx-2">
        <div>Password</div>
        <input
          className="input w-[calc(100%-0.375rem)]"
          type="password"
          value={signUpData.password}
          onChange={(e) => setSignUpData((value) => ({ ...value, password: e.target.value }))}
        ></input>
      </div>
      <div className="mt-4 mx-2">
        <div>Confirm Password</div>
        <input
          className="input w-[calc(100%-0.375rem)]"
          type="password"
          value={signUpData.confirmPassword}
          onChange={(e) => setSignUpData((value) => ({ ...value, confirmPassword: e.target.value }))}
        ></input>
      </div>
      <div className="my-4 text-center">
        <button className="button mx-1 text-white bg-blue">Sign up</button>
        <button className="button mx-1 bg-#ccc" onClick={() => setIsSignUp(() => false)}>Cancel</button>
      </div>
    </>;
  }

  return (
    <div className="flex flex-items-center flex-justify-center h-full">
      <div
        className="inline-block relative w-64 bg-[#f8f8f8] shadow-[0_0_1px_1px_#ddd]"
        onKeyUp={(e) => e.key==='Enter' && login()}
      >
        <div className="px-1 h-8 text-white bg-blue text-lg">
          { isSignUp ? 'Sign up' : 'Login' }
        </div>
        {isSignUp ? renderSignUp() : renderLogin()}
      </div>
    </div>
  );
}
