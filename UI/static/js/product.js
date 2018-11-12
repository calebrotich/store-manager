let url = new URL(window.location.href);
let product_id = Number(url.searchParams.get("product_id"));
const productAPIURI = `https://store-manager-api-v2.herokuapp.com/api/v2/product/${product_id}`;
const productMessageBox = document.querySelector("#products-message");
const productContainer = document.querySelector("#product-container");
const userToken = localStorage.userToken;

function fetchProduct() {
    // Send GET request to category endpoint
    productMessageBox.innerHTML = "";
    fetch(productAPIURI, {
        method: 'GET',
        headers: {
            'Authorization': userToken
        }
    })
    .then((response)=> {
        if(response.status < 500){
            return response.json()
        }
        else{
            productAPIURI.innerHTML = response;
        }
    })
    .then(function(json_response) {
        let message = json_response.message;
        let product = json_response.product;
        if(message === `${product[0].product_name} retrieved successfully`) {
            let div = document.createElement("div");
            div.innerHTML = `
            <h2>${product[0].product_name} @ Ksh. ${product[0].product_price}</h2>
            <div class="product-container">
              <div class="">
                <img src="../images/products_pictures/noimage.png" alt="Product">
              </div>
              <div class="">
                <h3>Features</h3>
                <ul>
                  <li>Amount in stock: ${product[0].inventory}</li>
                  <li>Minimum Quantity: ${product[0].min_quantity}</li>
                  <li>Category: ${product[0].category}</li>
                </ul>
                <button type="button" onClick="buildCart(${product[0].product_id}, '${product[0].product_name}', ${product[0].product_price})"> Add to cart</button>
                <br><br>
                <a href="products.html">Back to all products</a>
              </div>
            </div>
            `;
            productContainer.appendChild(div);
        }
        else if (json_response.Message === "You need to login" ||
                 json_response.Message === "The token is either expired or wrong") {
            window.location.replace("../../index.html");
        }
        else {
            productMessageBox.innerHTML = message;
        }
    })
    .catch(function(err) {
        console.log(err);
        productMessageBox.innerHTML = err;
    });
}

fetchProduct();