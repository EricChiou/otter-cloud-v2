import { SingIn } from './interface';

import Requset from '../request';

export default class UserAPI {
  private static readonly PRE_URL = '/user';

  public static Login(acc: string, pwd: string, rememberMe = false) {
    return Requset.Post<SingIn>(`${this.PRE_URL}/signIn`, { acc, pwd, rememberMe });
  }
}

  // public static SignUp(acc: string, name: string, pwd: string): Promise<Response> {
  //   return new Promise((resolve, reject) => {
  //     post(
  //       `${this.PRE_URL}/signUp`,
  //       { acc, name, pwd },
  //     ).then((resp: Response) => {
  //       resp.status === ApiResult.Success ? resolve(resp) : reject(resp);
  //     }).catch((error) => {
  //       reject(error);
  //     });
  //   });
  // }

// export const getUserFuzzyList = (acc: string, token: string): Promise<AccListResVo> => {
//   const search = { keyword: encodeURIComponent(acc) };

//   return new Promise((resolve, reject) => {
//     get(
//       ApiUrl.GET_USER_FUZZY_LIST,
//       search,
//       token,
//     ).then((resp) => {
//       resp.status === ApiResult.Success ? resolve(resp as AccListResVo) : reject(resp);

//     }).catch((error) => {
//       reject(error);
//     });
//   });
// };

// export const activateAcc = (activeCode: string): Promise<Response> => {
//   const body = { activeCode };

//   return new Promise((resolve, reject) => {
//     put(
//       ApiUrl.ACTIVATE_ACCOUNT,
//       body,
//       undefined,
//       undefined,
//     ).then((resp) => {
//       resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

//     }).catch((error) => {
//       reject(error);
//     });
//   });
// };

// export const sendActivationCode = (acc: string): Promise<Response> => {
//   const body = { acc };

//   return new Promise((resolve, reject) => {
//     put(
//       ApiUrl.SEND_ACTIVATION_CODE,
//       body,
//       undefined,
//       undefined,
//     ).then((resp) => {
//       resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

//     }).catch((error) => {
//       reject(error);
//     });
//   });
// };

// export const resetPwd = (acc: string): Promise<Response> => {
//   const body = { acc };

//   return new Promise((resolve, reject) => {
//     put(
//       ApiUrl.RESET_PWD,
//       body,
//       undefined,
//       undefined,
//     ).then((resp) => {
//       resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

//     }).catch((error) => {
//       reject(error);
//     });
//   });
// };

// export const updateUser = (
//   body: { name?: string; oldPwd?: string; newPwd?: string },
//   token: string,
// ): Promise<Response> => {

//   return new Promise((resolve, reject) => {
//     put(
//       ApiUrl.UPDATE_USER,
//       body,
//       undefined,
//       token,
//     ).then((resp) => {
//       resp.status === ApiResult.Success ? resolve(resp) : reject(resp);

//     }).catch((error) => {
//       reject(error);
//     });
//   });
// };
