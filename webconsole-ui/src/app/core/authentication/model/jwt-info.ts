/**
 * The jwt token info
 */
export class JwtInfo {
  /**
   * The subject
   */
  sub: string;

  /**
   * List of accessRights
   */
  accessRights: string | Array<string>;

  /**
   * The issuance time of the token
   */
  iat: number;

  /**
   * The expiration time of the token
   */
  exp: number;
}
