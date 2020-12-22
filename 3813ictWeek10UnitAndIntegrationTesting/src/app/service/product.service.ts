import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = 'http://localhost:3000'; // back-end url path, do not change


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor( private http: HttpClient ) { }

  getProducts() {
    return this.http.get<any>(BACKEND_URL + '/getItem');
  }

  getOneProduct(id) {
    return this.http.post<any>(BACKEND_URL + '/getOneItem', {objId: id});
  }

  addProduct(product) {
    return this.http.post<any>(BACKEND_URL + '/addItem', product);
  }

  editProduct(data) {
    return this.http.post<any>(BACKEND_URL + '/updateItem', data);
  }

  deleteProduct(id) {
    return this.http.post<any>(BACKEND_URL + '/deleteItem', {objId: id});
  }
}
