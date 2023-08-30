export enum ApiResult {
  Success = 'ok',
  AccInactive = 'accInactive',
  Duplicate = 'duplicate',
  PermissionDenied = 'permissionDenied',
  TokenError = 'tokenError',
  FormatError = 'formatError',
  ParseError = 'parseError',
  DBError = 'dbError',
  DataError = 'dataError',
  ServerError = 'serverError',
  MinioError = 'minioError',
  UnknownError = 'unknownError',
}

export interface Response<T = unknown> {
  status: ApiResult;
  data: T;
  trace: unknown;
}
