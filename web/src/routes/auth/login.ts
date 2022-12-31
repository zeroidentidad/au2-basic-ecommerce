import { IRouteableComponent, IRouter } from '@aurelia/router';
import { IAuthService } from '../../services/auth-service';

export class Login implements IRouteableComponent {
  username;
  password;

  constructor(@IAuthService private auth: IAuthService, @IRouter private router: IRouter) {}

  async submit() {
    if (this.username && this.password) {
      try {
        await this.auth.login(this.username, this.password);
        if (this.auth.isAdmin) {
          this.router.load(`/admin`);
        } else {
          this.router.load(`/dashboard`);
        }
      } catch (e) {
        window.alert('Hubo un error.');
      }
    }
  }
}
