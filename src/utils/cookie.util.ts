export class Cookie {
  /**
   * @param key Cookie key.
   */
  public static Get(key: string): string {
    const cookie = document.cookie;
    const cookies = cookie.split(';');
    for (const c of cookies) {
      const kv = c.trim().split('=', 2);
      if (kv[0] === key) {
        return kv[1];
      }
    }
    return '';
  }

  /**
   * @param key Cookie key.
   * @param value Cookie content.
   * @param expires Cookie expires time. (milliseconds)
   * @param path Cookie path.
   */
  public static Add(key: string, value: string, expires?: number, path?: string) {
    let cookie = `${key}=${value};`;
    if (expires !== undefined) {
      const date = new Date();
      date.setTime(date.getTime() + expires);
      cookie += ` expires=${date.toUTCString()};`;
    }
    cookie += ` path=${path ? path : '/'};`;

    document.cookie = cookie;
  }

  public static readonly remove = (key: string) => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };
}
