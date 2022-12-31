import { IRouteableComponent, IRouter } from '@aurelia/router';
import { ApiService } from '../../services/api-service';

export class AdminProducts implements IRouteableComponent {
  products = [];

  constructor(private api: ApiService) {}

  async binding() {
    this.products = await this.api.getProducts();
  }
}
