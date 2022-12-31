import { IRouteableComponent } from '@aurelia/router';
import { ApiService } from '../../services/api-service';

export class Products implements IRouteableComponent {
	products = [];

	constructor(private api: ApiService) {}

	async binding() {
		this.products = await this.api.getProducts();
	}
}
