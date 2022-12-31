import { IRouteableComponent, IRouter } from '@aurelia/router';
import { IAuthService } from '../../services/auth-service';

export class Register implements IRouteableComponent {
  username;
  password;
  password2;

  constructor(@IAuthService private auth: IAuthService, @IRouter private router: IRouter) {}

  async submit() {
    if (this.username && this.password && this.password2 && this.password === this.password2) {
      try {
        await this.auth.register(this.username, this.password);
        this.router.load(`/dashboard`);
      } catch (e) {
        window.alert('There was an error registering.');
      }
    }
  }
}
