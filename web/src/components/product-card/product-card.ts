import { ICustomElementViewModel } from '@aurelia/runtime-html';
import { bindable, HttpClient } from 'aurelia';
import { ApiService } from '../../services/api-service';

export class ProductCard implements ICustomElementViewModel {
	@bindable product;
	image;

	constructor(private api: ApiService, private http: HttpClient) {}

	async binding() {
		const request = await this.http.fetch('https://api.thecatapi.com/v1/images/search?mime_types=jpg');
		const response = await request.json();
		this.image = response[0].url;
	}
}