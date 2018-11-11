// Consume the sales endpoint from https://store-manager-api-v2.herokuapp.com/api/v2/
let sales = {};
let items = [];

if (localStorage.sales != undefined || localStorage.sales != null) {
    let salesObject = JSON.parse(localStorage.sales);
    let objectItems = salesObject.items;
    sales.items = objectItems;
} else {
    sales.items = items;
}

function buildCart(product, name, price) {
    if (localStorage.sales != undefined) {
        let salesData = JSON.parse(localStorage.sales);
        salesData.items.forEach(sale => {
            if (sale.product == product) {
                document.querySelector("#products-message").innerHTML = "Product added already";
                return;
            }
        });
    }
    var product = Number(product);
    let productName = name;
    let productPrice = Number(price);
    var quantity = 1;

    var sale = {
        "product": product,
        "name": productName,
        "price": productPrice,
        "quantity": quantity,
    }
    sales.items.push(sale);
    localStorage.sales = JSON.stringify(sales);
    console.log(JSON.stringify(sales));
}
