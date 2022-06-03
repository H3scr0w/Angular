import { TokenModel } from '@app/shared/token.model';
import { ITokenService } from '@app/shared/token.service';
import { Observable } from 'rxjs';

export class MockTokenService implements ITokenService {
  createLink(sgid: string, email: string): Observable<TokenModel> {
    return undefined;
  }

  getLink(resourceId: string): Observable<TokenModel> {
    return undefined;
  }
}
