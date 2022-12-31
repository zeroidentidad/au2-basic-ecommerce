import { IRouteableComponent } from '@aurelia/router';
import { ApiService } from '../../services/api-service';

export class Cart implements IRouteableComponent {
	cart = [];
	total = 0.0;

	constructor(private api: ApiService) {}

	binding() {
		this.cart = this.api.getCart();
		this.calculateTotal();
	}

	removeFromCart(id) {
		this.api.removeFromCart(id);
		this.cart = this.api.getCart();
		this.calculateTotal();
	}

	updateCart() {
		localStorage.setItem('cart', JSON.stringify(this.cart));
		this.calculateTotal();
	}

	calculateTotal() {
		this.total = this.cart
			.reduce((runningTotal, product) => {
				const total = parseInt(product.quantity) * product.price;
				return runningTotal + total;
			}, 0)
			.toFixed(2);
	}
}
