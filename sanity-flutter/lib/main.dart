import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:sanityecomm/product.dart';
import 'package:http/http.dart' as http;

void main() {
  HttpOverrides.global = new MyHttpOverrides();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: new ThemeData(scaffoldBackgroundColor: Colors.white),
        home: Scaffold(
            backgroundColor: Colors.white,
            body: MyHomePage(title: 'Flutter Demo Home Page')));
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      // This call to setState tells the Flutter framework that something has
      // changed in this State, which causes it to rerun the build method below
      // so that the display can reflect the updated values. If we changed
      // _counter without calling setState(), then the build method would not be
      // called again, and so nothing would appear to happen.
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return new FutureBuilder(
        future: getProductDetail(),
        builder: (BuildContext context, AsyncSnapshot<List<Product>> products) {
          if (products.hasData) {
            return new Padding(
                padding: EdgeInsets.all(16.0),
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Products",
                          style: TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.bold)),
                      Expanded(
                          child: Column(
                        children: [productDetail(products.data)],
                      ))
                    ]));
          } else {
            return new Padding(
                padding: EdgeInsets.all(16.0),
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("No data found",
                          style: TextStyle(
                              color: Colors.black, fontWeight: FontWeight.bold))
                    ]));
          }
        });
  }

  ListView productDetail(List<Product> productDetail) {
    print("Product detail");
    print(productDetail);
    return ListView.builder(
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        itemCount: productDetail.length,
        itemBuilder: (context, i) {
          return new Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15.0),
              ),
              color: Colors.blue,
              elevation: 10,
              child: Column(mainAxisSize: MainAxisSize.min, children: <Widget>[
                ListTile(
                  leading: SizedBox(
                      height: 100.0,
                      width: 100.0, // fixed width and height
                      child: Image.network(productDetail[i].productimage)),
                  title: Text(productDetail[i].name),
                  subtitle:
                      Text("Price : Rs " + productDetail[i].price.toString()),
                )
              ]));
        });
  }

  Future<List<Product>> getProductDetail() async {
    try {
      print("Called async");
      String url = "https://192.168.1.4:3001/products/";
      print(url);
      final http.Response response =
          await http.get(url, headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      });

      print("Response data");
      print(response);

      List<Product> prod = new List<Product>();

      if (response.statusCode == 200) {
        print(json.decode(response.body));
        List t = json.decode(response.body);
        prod = t.map((item) => Product.fromJson(item)).toList();
      }

      print("Parsed data");
      print(prod);

      return prod;
    } catch (ex) {
      print(ex);
    }
  }
}

class MyHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext context) {
    return super.createHttpClient(context)
      ..badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
  }
}
