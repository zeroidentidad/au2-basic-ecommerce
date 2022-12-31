import { IRouteableComponent } from '@aurelia/router';
import { IAuthService } from '../../services/auth-service';
import { ApiService } from '../../services/api-service';

export class Order implements IRouteableComponent {
  static parameters = ['id'];
  order;

  constructor(private api: ApiService, @IAuthService private auth: IAuthService) {}

  public async load(parameters: { id }) {
    let userId = this.auth.getCurrentUser()?.id;
    if (parameters.id && userId) {
      this.order = await this.api.getOrder(userId, parameters.id);
      if (this.order.cart) {
        this.order.cart = JSON.parse(this.order.cart) ?? [];
      }
    }
  }

  subTotals(product) {
    return (product.price * product.quantity).toFixed(2);
  }
}
