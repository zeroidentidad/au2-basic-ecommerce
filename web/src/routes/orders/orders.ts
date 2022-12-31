import { IRouteableComponent } from '@aurelia/router';
import { IAuthService } from '../../services/auth-service';
import { ApiService } from '../../services/api-service';

export class Orders implements IRouteableComponent {
  orders = [];

  constructor(private api: ApiService, @IAuthService private auth: IAuthService) {}

  async binding() {
    let userId = this.auth.getCurrentUser()?.id;
    if (userId) {
      this.orders = await this.api.getOrders(userId);
    }
  }
}
