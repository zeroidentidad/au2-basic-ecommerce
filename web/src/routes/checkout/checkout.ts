import { IRouteableComponent, IRouter } from '@aurelia/router';
import { newInstanceForScope } from '@aurelia/kernel';
import { IValidationController, IValidationResultPresenterService } from '@aurelia/validation-html';
import { IValidationRules } from '@aurelia/validation';
import { IAuthService } from '../../services/auth-service';
import { ApiService } from '../../services/api-service';

const sleep = (ms: number) => setTimeout(() => Promise.resolve(), ms);

export class Checkout implements IRouteableComponent {
  cart = [];
  total;
  totalItems = 0;

  details = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    address2: '',
    country: '',
    state: '',
    zip: '',
    paymentType: 'credit',
    ccName: '',
    ccNumber: '',
    ccExpiration: '',
    ccCvv: '',
  };

  processing = false;

  constructor(
    private api: ApiService,
    @IAuthService private auth: IAuthService,
    @IRouter private router: IRouter,
    @newInstanceForScope(IValidationController) private validationController: IValidationController,
    @IValidationRules validationRules: IValidationRules,
    @IValidationResultPresenterService private presenter: IValidationResultPresenterService
  ) {
    this.validationController.addSubscriber(this.presenter);
    validationRules
      .on(this.details)
      .ensure('firstName')
      .required()
      .ensure('lastName')
      .required()
      .ensure('email')
      .required()
      .email()
      .ensure('address')
      .required()
      .ensure('country')
      .required()
      .ensure('state')
      .required()
      .ensure('zip')
      .required()
      .ensure('paymentType')
      .required()
      .ensure('ccName')
      .required()
      .when((p) => p.paymentType === 'credit')
      .ensure('ccNumber')
      .required()
      .when((p) => p.paymentType === 'credit')
      .ensure('ccExpiration')
      .required()
      .when((p) => p.paymentType === 'credit')
      .ensure('ccCvv')
      .required()
      .when((p) => p.paymentType === 'credit');
  }

  binding() {
    this.cart = this.api.getCart();
    this.totalItems = this.api.getCartTotal();
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

  subTotals(product) {
    return (product.quantity * product.price).toFixed(2);
  }

  async submit() {
    let userId = this.auth.getCurrentUser()?.id;
    const result = await this.validationController.validate();
    if (result.valid && userId) {
      this.processing = true;

      await sleep(1500); // simulate wait 1.5 seconds for response
      const order: { orderId; success } = await this.api.processOrder(userId, this.details, this.cart);

      if (order.success) {
        this.router.load(`/order/${order.orderId}`);
      }

      this.processing = false;
    }
  }
}
