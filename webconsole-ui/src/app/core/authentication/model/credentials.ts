/**
 * The credential object
 */
export interface Credentials {
  /**
   * The email
   */
  email: string;
  /**
   * The expires date
   */
  expires: number;
  /**
   * List of rights
   */
  accessRights: string[];
  /**
   * The issued at date
   */
  issued_at: number;
  /**
   * The JWT
   */
  jwt: string;
  /**
   * If user can access to admin functionalities
   */
  hasAdminAccess: boolean;
}
