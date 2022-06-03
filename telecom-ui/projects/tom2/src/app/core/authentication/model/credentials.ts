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
    The user is RSM to use some functionalities
  */
  isRsm: boolean;
  /*
    The user has ORDER rights to use some functionalities
  */
  isOrderUser: boolean;
  /*
    The user is PM to use some functionalities
  */
  isPmUser: boolean;
  /*
   The user has REQUESTER rights to use some functionalities
 */
  isRequesterUser: boolean;
}
