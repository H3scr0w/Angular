/**
 * The token info retrieve from API Management
 */
export class TokenInfo {
  /**
   * The access token
   */
  access_token: string;
  /**
   * The expires time of the token
   */
  expires_in: number;
  /**
   * The refresh token
   */
  refresh_token: string;
  /**
   * The JWT
   */
  id_token: string;
}
