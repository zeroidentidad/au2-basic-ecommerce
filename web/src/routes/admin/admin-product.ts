import { IRouteableComponent, IRouter } from '@aurelia/router';
import { ApiService } from '../../services/api-service';
import { IHttpClient } from '@aurelia/fetch-client';

export class AdminProduct implements IRouteableComponent {
  static parameters = ['id'];
  product;
  image;

  constructor(@IRouter private router: IRouter, private api: ApiService, @IHttpClient private http: IHttpClient) {}

  async binding() {
    const request = await this.http.fetch('https://api.thecatapi.com/v1/images/search?mime_types=jpg');
    const response = await request.json();
    this.image = response[0].url;
  }

  async load(parameters) {
    this.product = await this.api.getProduct(parameters.id);
  }

  async save() {
    let response = await this.api.updateProduct(this.product);
    if (response.success) {
      this.router.load(`/admin/admin-products`);
    }
  }
}
