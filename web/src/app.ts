import { EventAggregator, IDisposable } from 'aurelia';
import { IRouter } from '@aurelia/router';
import { IAuthService } from './services/auth-service';
import { AuthHook } from './auth-hook';
//Store routeable components
import { Faq } from './routes/faq';
import { Products } from './routes/products/products';
import { Product } from './routes/product/product';
import { Cart } from './routes/cart/cart';
import { Checkout } from './routes/checkout/checkout';
import { Dashboard } from './routes/dashboard/dashboard';
import { Orders } from './routes/orders/orders';
import { Order } from './routes/orders/order';
import { Login } from './routes/auth/login';
import { Register } from './routes/auth/register';
//Admin routeable components
import { Admin } from './routes/admin/admin';

export class App {
  static dependencies = [AuthHook];
  static routes = [
    {
      id: 'faq',
      path: ['/faq'],
      component: Faq,
    },
    {
      id: 'products',
      path: '/products',
      component: Products,
    },
    {
      id: 'product',
      path: '/product/:id',
      component: Product,
    },
    {
      id: 'cart',
      path: '/cart',
      component: Cart,
    },
    {
      id: 'checkout',
      path: '/checkout',
      component: Checkout,
    },
    {
      id: 'dashboard',
      path: '/dashboard',
      component: Dashboard,
    },
    {
      id: 'orders',
      path: '/orders',
      component: Orders,
    },
    {
      id: 'order',
      path: '/order/:id',
      component: Order,
    },
    {
      id: 'login',
      path: '/login',
      component: Login,
    },
    {
      id: 'register',
      path: '/register',
      component: Register,
    },
    {
      id: 'admin',
      path: '/admin',
      component: Admin,
    },
  ];

  showSearch = false;
  searchListener: IDisposable;

  constructor(@IRouter private router: IRouter, @IAuthService private auth: IAuthService, private ea: EventAggregator) {}

  binding() {
    this.searchListener = this.ea.subscribe('search:open', () => (this.showSearch = true));
  }

  unbinding() {
    this.searchListener.dispose();
  }
}
