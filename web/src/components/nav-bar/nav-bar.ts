import { ApiService } from '../../services/api-service';
import { IAuthService } from '../../services/auth-service';
import { ICustomElementViewModel } from '@aurelia/runtime-html';
import { EventAggregator, IDisposable } from 'aurelia';

export class NavBar implements ICustomElementViewModel {
  cartTotal = 0;
  cartAddSubscription: IDisposable;
  cartRemoveSubscription: IDisposable;

  constructor(private api: ApiService, @IAuthService private auth: IAuthService, private ea: EventAggregator) {}

  binding() {
    this.cartTotal = this.api.getCartTotal();

    this.cartAddSubscription = this.ea.subscribe('cart:add', () => {
      this.cartTotal = this.api.getCartTotal();
    });

    this.cartRemoveSubscription = this.ea.subscribe('cart:remove', () => {
      this.cartTotal = this.api.getCartTotal();
    });
  }

  logout() {
    this.auth.logout('home');
  }

  showSearch(){
    this.ea.publish('search:open');
  }
}
