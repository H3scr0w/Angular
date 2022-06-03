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
     The user is SIRENE user to use some functionalities
   */
  isUser: boolean;
  /*
     The user is DO user to use some functionalities
   */
  isDoUser: boolean;
  /*
     The user is DO admin to use some functionalities
   */
  isDoAdmin: boolean;

  /*
     The user is SPO user to use some functionalities
   */
  isSpoUser: boolean;
  /*
     The user is SPO admin to use some functionalities
   */
  isSpoAdmin: boolean;
}
