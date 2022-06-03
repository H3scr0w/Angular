/**
 * The credential object
 */
export interface Credentials {
  /**
   * The sgid
   */
  sgid: string;
  /**
   * The token
   */
  token: string;
  /**
   * The expires date
   */
  expires: number;
  /**
   * List of groups
   */
  groups: string[];
  /**
   * The issued at date
   */
  issued_at: number;
  /**
   * The JWT
   */
  jwt: string;
  /*
    The user is Admin to use some functionalities
  */
  isAdmin: boolean;
  /*
    The user can modify some functionalities
  */
  isModifyUser: boolean;
  /*
   The user can supervise some functionalities
 */
  isSupervisor: boolean;
}
