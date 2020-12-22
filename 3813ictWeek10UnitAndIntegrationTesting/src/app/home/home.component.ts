import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  itemNumber = 0;

  constructor(private prodService: ProductService) { }

  ngOnInit() {
    this.prodService.getProducts().subscribe((data) => {
      if (data.length !== 0) {
        this.itemNumber = data.length;
      }
    });
  }

}
