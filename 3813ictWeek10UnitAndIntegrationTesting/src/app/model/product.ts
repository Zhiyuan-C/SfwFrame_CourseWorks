export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  units: number;
  objId = null;
  constructor(id: number, name: string, description: string, price: number, units: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.units = units;
  }
}
