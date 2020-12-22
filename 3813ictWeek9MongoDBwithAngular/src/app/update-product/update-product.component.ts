import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../model/product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  objId = null;
  // ngmodel and ngif
  userInput = {
    productName: '',
    productDesc: '',
    productId: null,
    productPrice: null,
    productUnits: null
  };

  error = {
    id: {status: false, message: ''},
    name: {status: false, message: ''},
    description: {status: false, message: ''},
    price: {status: false, message: ''},
    units: {status: false, message: ''},
  };


  constructor( private router: Router, private activeRouter: ActivatedRoute, private prodService: ProductService) {
  }

  ngOnInit() {
    this.activeRouter.params.subscribe((param) => {
      this.objId = param.id;
      this.prodService.getOneProduct(param.id).subscribe((data) => {
        this.userInput = {
          productName: data[0].name,
          productDesc: data[0].description,
          productId: data[0].id,
          productPrice: data[0].price,
          productUnits: data[0].units
        };
        console.log(this.userInput);
      });
    });
  }


  setDefaultError(key) {
    if (key === 'productId') {
      this.error.id = {status: false, message: ''};
    } else if (key === 'productName') {
      this.error.name = {status: false, message: ''};
    } else if (key === 'productDesc') {
      this.error.description = {status: false, message: ''};
    } else if (key === 'productPrice') {
      this.error.price = {status: false, message: ''};
    } else if (key === 'productUnits') {
      this.error.units = {status: false, message: ''};
    }
  }

  displayError(key, msg) {
    if (key === 'productId') {
      this.error.id = {status: true, message: msg};
    } else if (key === 'productName') {
      this.error.name = {status: true, message: msg};
    } else if (key === 'productDesc') {
      this.error.description = {status: true, message: msg};
    } else if (key === 'productPrice') {
      this.error.price = {status: true, message: msg};
    } else if (key === 'productUnits') {
      this.error.units = {status: true, message: msg};
    }
  }

  editProduct() {
    // check input validation
    let valid = true;

    for (const input in this.userInput) {
      if (this.userInput.hasOwnProperty(input)) {
        if (input === 'productName' || input === 'productDesc') {
          if (this.userInput[input] === '') {
            this.displayError(input, 'Empty input');
          } else {
            this.setDefaultError(input);
          }
        } else {
          if (this.userInput[input] === null) {
            this.displayError(input, 'Invalid input, must have number');
          } else if (input === 'productUnits' || input === 'productId') {
            if (!Number.isInteger(this.userInput[input])) {
              this.displayError(input, 'Must be an interger');
            } else {
              this.setDefaultError(input);
            }
          } else {
            this.setDefaultError(input);
          }
        }
      }
    }

    for (const key in this.error) {
      if (this.error.hasOwnProperty(key)) {
        if (this.error[key].status) {
          valid = false;
        }
      }
    }

    // add item to database
    if (valid) {
      const productToEdit = [this.objId];
      const newProduct = new Product(
        this.userInput.productId,
        this.userInput.productName,
        this.userInput.productDesc,
        this.userInput.productPrice,
        this.userInput.productUnits
      );
      productToEdit.push(newProduct);
      this.prodService.editProduct(productToEdit).subscribe((data) => {
        if (data.ok) {
          this.router.navigateByUrl('/products');
        }
      });

    }

  }




}
