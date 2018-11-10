// Consume the products endpoint from https://store-manager-api-v2.herokuapp.com/api/v2/
'use strict';
const productsAPIURI = "https://store-manager-api-v2.herokuapp.com/api/v2/";
const saveProduct = document.querySelector("#save-product");
const productsMessageBox = document.querySelector("#products-message");

saveProduct.addEventListener('click', (event) => {
    productsMessageBox.innerHTML = "";
    saveProduct.disabled = true;
    saveProduct.value = "Creating product...";
    const productName = document.querySelector("#add-product-name").value;
    const productPrice = document.querySelector("#add-product-price").value;
    const productInventory = document.querySelector("#add-product-inventory").value;
    const productMinQuantity = document.querySelector("#add-product-minquantity").value;
    const productCategory = document.querySelector("#categories-select").value;

    event.preventDefault();

    let productData = {
        "product_name": productName,
        "product_price": Number(productPrice),
        "inventory": Number(productInventory),
        "min_quantity": Number(productMinQuantity),
        "category": Number(productCategory)
    };

    // Send POST request to products endpoint
    fetch(`${productsAPIURI}products`, {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userToken
        }
    })
    .then((response)=> {
        if(response.status < 500){
            return response.json()
        }
        else{
            productsMessageBox.innerHTML = response;
        }
    })
    .then(function(json_response) {
        let message = json_response.message;
        if(message === "Product added successfully") {
            productsMessageBox.style.color = "green";
            productsMessageBox.innerHTML = message;
            saveProduct.value = "Add another product";
            saveProduct.disabled = false;
        }
        else {
            productsMessageBox.style.color = "red";
            productsMessageBox.innerHTML = message;
            saveProduct.value = "Add product";
            saveProduct.disabled = false;
        }
    })
    .catch(function(err) {
        console.log(err);
        productsMessageBox.innerHTML = err;
        saveProduct.disabled = false;
    });
});