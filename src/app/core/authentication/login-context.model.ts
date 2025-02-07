/**
 * Login context model.
 */
export interface LoginContext {
  tenant?: string;
  username: string;
  password: string;
  remember: boolean;
}
