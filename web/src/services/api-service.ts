import { HttpClient, json } from '@aurelia/fetch-client';
import { inject, EventAggregator } from 'aurelia';

@inject(HttpClient, EventAggregator)
export class ApiService {
  constructor(private http: HttpClient, private ea: EventAggregator) {
    // Call configure method to get the configuration object
    http.configure((config) => {
      // Prefix all API requests with this URL, it saves us having to repeat it
      config.withBaseUrl('http://localhost:3002');
      // Configure method expects us to return the config object
      return config;
    });
  }

  // Gets all projects from the API
  async getProducts() {
    const response = await this.http.get('/products');
    return response.json();
  }

  // Get a product by its ID from the API
  async getProduct(productId) {
    const response = await this.http.get(`/product/${productId}`);
    return response.json();
  }

  // Update product
  async updateProduct(product) {
    const response = await this.http.put(
      `/product/${product.id}`,
      json({
        ...product,
      })
    );
    return response.json();
  }

  // Get all orders for a user from the API
  async getOrders(userId) {
    const response = await this.http.post('/orders', json({ userId: userId }));
    return response.json();
  }

  async getOrder(userId, orderId) {
    const response = await this.http.post('/order', json({ userId: userId, orderId: orderId }));
    return response.json();
  }

  // Post order of a user from the API
  async processOrder(userId, checkoutFields, cart) {
    const response = await this.http.post('/processOrder', json({ userId: userId, checkoutFields, cart }));
    return response.json();
  }

  // A login method to verify a users login credentials
  async login(username, password) {
    const response = await this.http.post('/user', json({ username, password }));
    return response.json();
  }

  // Method to create a new user
  async register(username, password) {
    const response = await this.http.post('/register', json({ username, password }));
    return response.json();
  }

  // Helpers to cart
  addToCart(product) {
    const existingCart = this.getCart();

    // Do we already have this product in our cart?
    const itemAlreadyExists = existingCart.find((p) => p.id === product.id);

    // If we already have a product, increment the quantity
    if (itemAlreadyExists) {
      itemAlreadyExists.quantity++;
    } else {
      // This is a new product, set quantity to 1
      product.quantity = 1;
      existingCart.push(product);
    }

    // Save the cart
    localStorage.setItem('cart', JSON.stringify(existingCart));

    this.ea.publish('cart:add', product.id);

    return existingCart;
  }

  getCart() {
    return JSON.parse(localStorage.getItem('cart')) ?? [];
  }

  getCartTotal() {
    const cart = this.getCart();

    return cart.reduce((runningTotal, product) => {
      return runningTotal + parseInt(product.quantity);
    }, 0);
  }

  // Search by keyword
  async search(term) {
    const response = await this.http.post('/search', json({ query: term }));
    return response.json();
  }

  removeFromCart(productId) {
    let existingCart = this.getCart();
    // Already we have this product in cart?
    const itemAlreadyExists = existingCart.find((p) => p.id === productId);

    // We have this item in cart and the quantity is greater than zero
    if (itemAlreadyExists && itemAlreadyExists.quantity > 0) {
      itemAlreadyExists.quantity--;
      // Did removing the item just set the quantity to zero?
      if (!itemAlreadyExists.quantity) {
        // Remove the item completely
        existingCart = existingCart.filter((product) => product.id !== productId);
      }
    }

    // Save the cart
    localStorage.setItem('cart', JSON.stringify(existingCart));
    this.ea.publish('cart:remove', productId);
    return existingCart;
  }
}