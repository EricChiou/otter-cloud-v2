import { Lang, UserProfile } from '@/types/user';

import Cookie from '@/utils/cookie.util';

export default class UserService {
  private static readonly TokenKey = 'token';
  private static readonly Expires = 4102444800000;

  public static GetLang(): Lang {
    const lang = Cookie.Get('lang') || window.navigator.language;
    if (lang.startsWith(Lang.EN)) return Lang.EN;
    if (lang.startsWith(Lang.ZH)) return Lang.ZH;
    return Lang.EN;
  }

  public static GetToken(): string {
    const base64 = Cookie.Get(this.TokenKey);
    try {
      return atob(base64);
    } catch (error) {
      console.error(error);
    }
    return '';
  }

  public static SetToken(jwt: string) {
    Cookie.Add(this.TokenKey, btoa(jwt), this.Expires);
  }

  public static GetProfile(): UserProfile {
    const userProfile: UserProfile = {
      acc: '',
      name: '',
      roleCode: '',
      ip: '',
      exp: 0,
    };
    const token = this.GetToken();
    if (!token) return userProfile;

    const seg = token.split('.');
    if (seg.length !== 3) return userProfile;

    const decode = decodeURIComponent(atob(seg[1]));
    if (!decode) return userProfile;

    try {
      const parse: UserProfile = JSON.parse(decode);
      if (!parse) { return userProfile; }

      userProfile.acc = parse.acc;
      userProfile.name = parse.name;
      userProfile.roleCode = parse.roleCode;
      userProfile.ip = parse.ip;
      userProfile.exp = parse.exp;
    } catch (error) {
      console.error('cookie token parse error:', error);
    }
    return userProfile;
  }
}

