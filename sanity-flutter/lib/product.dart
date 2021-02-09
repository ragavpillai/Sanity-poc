class Product {
  final String name;
  final List<dynamic> description;
  final num price;
  final String productimage;

  Product(this.name, this.description, this.price, this.productimage);

  Product.fromJson(Map<String, dynamic> json)
      : name = json['name'],
        description = json['description'],
        price = json['price'],
        productimage = json['productimage'];

  Map<String, dynamic> toJson() => {
        "name": name,
        "description": description,
        "price": price,
        "productimage": productimage
      };
}
