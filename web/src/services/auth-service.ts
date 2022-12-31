import { DI } from 'aurelia';
import { IRouter } from '@aurelia/router';
import { ApiService } from './api-service';

// AuthService exported via IAuthService interface dep injection way
// at the end
export interface IAuthService extends AuthService {}

export class AuthService {
  isLoggedIn = false;
  _user = null;

  constructor(private api: ApiService, @IRouter private router: IRouter) {
    const userLogged = sessionStorage.getItem('au2webstore__auth');
    if (userLogged) {
      this.isLoggedIn = true;
      this._user = JSON.parse(userLogged);
    }
  }

  async login(username, password) {
    const user = await this.api.login(username, password);
    if (user) {
      this.isLoggedIn = true;
      this._user = user;
      sessionStorage.setItem('au2webstore__auth', JSON.stringify(user));
    }
  }

  logout(redirect = null) {
    this.isLoggedIn = false;
    this._user = null;
    sessionStorage.removeItem('au2webstore__auth');
    if (redirect) {
      this.router.load(redirect);
    }
  }

  async register(username, password) {
    const register = await this.api.register(username, password);
    if (register.success) {
      this.isLoggedIn = true;
      this._user = {
        username,
      };
      sessionStorage.setItem('au2webstore__auth', JSON.stringify(this._user));
    }
  }

  getCurrentUser() {
    return this._user;
  }

  get isAdmin() {
    return this.isLoggedIn && this._user?.username === 'admin';
  }
}

export const IAuthService = DI.createInterface<IAuthService>('IAuthService', (x) => x.singleton(AuthService));