// Consume the products endpoint from https://store-manager-api-v2.herokuapp.com/api/v2/
'use strict';
const productsAPIURI = "https://store-manager-api-v2.herokuapp.com/api/v2/";
const saveProduct = document.querySelector("#save-product");
const productsMessageBox = document.querySelector("#products-message");
const productsTable = document.querySelector("#products-table");

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
            window.location.replace("manage-product.html");
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
            productsMessageBox.innerHTML = response;
        }
    })
    .then(function(json_response) {
        let message = json_response.message;
        if(message === "Successfully fetched all the products") {
            let products = json_response.products;
            let counter = 1;
            products.forEach(product => {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                <tr>
                    <td>${counter}</td>
                    <td>${product.product_name}</td>
                    <td contenteditable="true" id="price-${product.product_id}">${product.product_price}</td>
                    <td>${product.category}</td>
                    <td contenteditable="true" id="inventory-${product.product_id}">${product.inventory}</td>
                    <td contenteditable="true" id="minquantity-${product.product_id}">${product.min_quantity}</td>
                    <td>
                        <button type="button" onclick="editProduct(${product.product_id}, ${product.category})" id="edit-${product.product_id}">
                            <span class="fa fa-save"></span>
                        </button>
                        <button type="button" onclick="deleteProduct(${product.product_id})" id="delete-${product.product_id}">
                            <span class="fa fa-trash"></span>
                        </button>
                    </td>
                <tr>`
              counter++;
              productsTable.appendChild(tr);
            });
        }
        else if (message === "No categories created yet") {
            let option = document.createElement("option");
            option.innerHTML = message;
            option.setAttribute("value", -1);
            categoriesSelect.appendChild(option);
        }
        else if (json_response.Message === "You need to login" ||
                 json_response.Message === "The token is either expired or wrong") {
            window.location.replace("../../index.html");
        }
        else {
            productsMessageBox.innerHTML = message;
        }
    })
    .catch(function(err) {
        console.log(err);
        productsMessageBox.innerHTML = err;
    });
}

function deleteProduct(product) {
    let deleteProductURI = `${productsAPIURI}product/${Number(product)}`;
    fetch(deleteProductURI, {
        method: 'DELETE',
        headers: {
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
        if(message === "Product deleted successfully") {
            window.location.replace("manage-product.html")
        }
        else if (json_response.Message === "You need to login" ||
                 json_response.Message === "The token is either expired or wrong") {
            window.location.replace("../../index.html");
        }
        else {
            productsMessageBox.innerHTML = message;
        }
    })
    .catch(function(err) {
        console.log(err);
        productsMessageBox.innerHTML = err;
    });
}

function editProduct(product, category) {
    // Send PUT request to products endpoint
    let productPrice = document.querySelector(`#price-${product}`).innerHTML;
    let productInventory = document.querySelector(`#inventory-${product}`).innerHTML;
    let productMinQuantity = document.querySelector(`#minquantity-${product}`).innerHTML;
    let productData = {
        "product_price": Number(productPrice),
        "inventory": Number(productInventory),
        "min_quantity": Number(productMinQuantity),
        "category": Number(category)
    };

    // Send POST request to products endpoint
    fetch(`${productsAPIURI}product/${Number(product)}`, {
        method: 'PUT',
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
        if(message === "Product updated successfully") {
            window.location.replace("manage-product.html");
        }
        else if (json_response.Message === "You need to login" ||
                 json_response.Message === "The token is either expired or wrong") {
            window.location.replace("../../index.html");
        }
        else {
            productsMessageBox.innerHTML = message;
        }
    })
    .catch(function(err) {
        console.log(err);
        productsMessageBox.innerHTML = err;
    });
}

fetchProducts();