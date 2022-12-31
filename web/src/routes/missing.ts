import { IRouteableComponent } from '@aurelia/router';
export class Missing implements IRouteableComponent {
	static parameters = ['id'];
	missingComponent;

	load(parameters) {
		this.missingComponent = parameters.id;
	}
}
