import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private prodService: ProductService, private router: Router) { }

  noProduct = true;
  productList = [];
  prodId = null;

  ngOnInit() {
    this.prodService.getProducts().subscribe((data) => {
      if (data.length !== 0) {
        this.noProduct = false;
        this.productList = data;
      }
    });
  }

  deleteProduct(id) {
    if (confirm('Are you sure want to delete current item?')) {
      this.prodService.deleteProduct(id).subscribe((data) => {
        this.productList = data;
      });
    }
  }


}
