import { lifecycleHooks } from 'aurelia';
import { Navigation, Parameters, RoutingInstruction } from '@aurelia/router';

@lifecycleHooks()
export class AuthHook {
  isLoggedIn = true;

  canLoad(viewModel, params: Parameters, instruction: RoutingInstruction, navigation: Navigation) {
    return this.isLoggedIn;
  }
}
