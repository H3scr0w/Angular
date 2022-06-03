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
    The user is PCPEG admin to use all functionalities
  */
  isAdmin: boolean;
  /*
     The user is PCPEG user to use some functionalities
   */
  isUser: boolean;
}
