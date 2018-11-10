// Consume the products endpoint from https://store-manager-api-v2.herokuapp.com/api/v2/
'use strict';
const productsAPIURI = "https://store-manager-api-v2.herokuapp.com/api/v2/";
const productsContainer = document.querySelector("#products-container");
const userToken = localStorage.userToken;

function fetchProducts() {
    // Send GET request to products endpoint
    fetch(`${productsAPIURI}products`, {
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
            productsContainer.innerHTML = response;
        }
    })
    .then(function(json_response) {
        let message = json_response.message;
        if(message === "Successfully fetched all the products") {
            let products = json_response.products;
            products.forEach(product => {
                let div = document.createElement("div");
                div.innerHTML = `
                <div>
                    <a href="product.html?product_id=${product.product_id}">
                        <img class="product-image" src="../images/products_pictures/noimage.png" alt="Phone">
                    </a>
                    <br>
                    <span class="product-name">
                        <a href="product.html?product_id=${product.product_id}">${product.product_name}</a>
                    </span>
                    <br>
                    <span class="product-description">
                        Stock amount: ${product.inventory} <br />
                        Minimum quantity: ${product.min_quantity} <br />
                        Product Category: ${product.category}
                    </span>
                    <br>
                    <span class="product-price">Ksh. ${product.product_price}</span>
                    <br>
                    <button type="button" name="button"> Add to cart</button>
                </div>`
              productsContainer.appendChild(div);
            });
        }
        else if (message === "There are no products in the store yet") {
            let div = document.createElement("div");
            div.innerHTML = message;
            productsContainer.appendChild(div);
        }
        else if (json_response.Message === "You need to login" ||
                 json_response.Message === "The token is either expired or wrong") {
            window.location.replace("../../index.html");
        }
        else {
            productsContainer.innerHTML = message;
        }
    })
    .catch(function(err) {
        console.log(err);
        productsContainer.innerHTML = err;
    });
}

fetchProducts();