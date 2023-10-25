import { create } from 'zustand';

import { UserProfile, Lang } from '@/types/user';

import Router, { routes } from '@/router';
import UserService from '@/services/user.service';
import UserAPI from '@/api/user';

interface UserState {
  user: UserProfile;
  lang: Lang;
}

interface UserAction {
  setUser: (user: UserProfile) => void;
  setLang: (lang: string) => void;
  login: (acc: string, pwd: string, rememberMe?: boolean) => void;
}

const initialState: UserState = {
  user: {
    acc: '',
    name: '',
    roleCode: '',
    ip: '',
    exp: 0,
  },
  lang: UserService.GetLang(),
};

const useUserStore = create<UserState & UserAction>((set) => ({
  ...initialState,
  setUser: (user: UserProfile) => set(() => ({ user: user })),
  setLang: (lang: string) => {
    if (lang.startsWith(Lang.EN)) {
      return set(() => ({ lang: Lang.EN }));
    } else if (lang.startsWith(Lang.ZH)) {
      return set(() => ({ lang: Lang.ZH }));
    }
    set(() => ({ lang: Lang.EN }));
  },
  login: (acc: string, pwd: string, rememberMe = false) => {
    UserAPI.Login(acc, pwd, rememberMe).then((resp) => {
      UserService.SetToken(resp.data.data.token);
      set(() => ({ user: UserService.GetProfile() }));
      Router.navigate(routes.home);
    });
  },
}));

export default useUserStore;
