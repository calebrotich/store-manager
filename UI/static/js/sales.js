// Consume the products endpoint from https://store-manager-api-v2.herokuapp.com/api/v2/saleorder
'use strict';
const salesAPIURI = "http://127.0.0.1:5000/api/v2/saleorder";
const makeSale = document.querySelector("#checkout-button");
const salesMessageBox = document.querySelector("#sales-message");
const salesTable = document.querySelector("#sales-table");
let userToken = localStorage.userToken;

// Make sale
makeSale.addEventListener('click', (event) => {
    salesMessageBox.innerHTML = "";
    makeSale.disabled = true;
    makeSale.value = "Processing sale...";

    event.preventDefault();

    let saleData = localStorage.sales;

    // Send POST request to products endpoint
    fetch(salesAPIURI, {
        method: 'POST',
        body: saleData,
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
            salesMessageBox.innerHTML = response;
        }
    })
    .then(function(json_response) {
        let message = json_response.message;
        if(message === "Checkout complete") {
            salesMessageBox.style.color = "green";
            salesMessageBox.innerHTML = message;
            makeSale.value = "Checkout";
            setTimeout(() => {
                window.location.replace("cart.html");
            }, 1500);
            makeSale.disabled = false;
            localStorage.removeItem("sales");
        }
        else {
            salesMessageBox.style.color = "red";
            salesMessageBox.innerHTML = message;
            makeSale.value = "Add product";
            makeSale.disabled = false;
        }
    })
    .catch(function(err) {
        console.log(err);
        salesMessageBox.innerHTML = err;
        makeSale.disabled = false;
    });
});

// Populates the cart as per the choices made
function populateSalesTable() {
    if (localStorage.sales != undefined) {
        let salesData = JSON.parse(localStorage.sales);
        if (localStorage.sales == `{"items":[]}`) {
            salesMessageBox.innerHTML = "Nothing in the cart";
            return;
        }
    let counter = 1;
    let amount = 0;
    while (salesTable.firstChild) {
        salesTable.removeChild(salesTable.firstChild);
    }
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <th>S/N</th>
        <th>Product</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Action</th>
    `;
    salesTable.appendChild(tr);
    salesData.items.forEach(sale => {
        console.log(sale);
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${counter}</td>
            <td>${sale.name}</td>
            <td>Ksh. ${sale.price}</td>
            <td><input type="number" min-value=1 onchange="updateQuantity(this.value, ${sale.product})" id="product-quantity-${sale.product}" min="0" value="${sale.quantity}"></td>
            <td>
                <button type="button" id="delete-sale-${sale.product}" onclick="removeFromCart(${sale.product})">
                    <span class="fa fa-trash"></span>
                </button>
            </td>
        `;
        amount+=(sale.price * sale.quantity);
        salesTable.appendChild(tr);
        counter++;
    });
    makeSale.innerHTML = `CHECKOUT Ksh. ${amount}`;
    makeSale.style.display = "block";
    } else {
        salesMessageBox.innerHTML = "Nothing in the cart";
    }
    
}

// Handle change in quantity value from the cart
function updateQuantity(quantity, product) {
    if(quantity == "") {
        quantity=1;
    }

    let salesData = JSON.parse(localStorage.sales);
    salesData.items.forEach(sale => {
        if (sale.product == product) {
            sale.quantity = Number(quantity);
        }
    });
    localStorage.sales = JSON.stringify(salesData);
    console.log(JSON.stringify(salesData));
    populateSalesTable();
}

function removeFromCart(product) {
    let salesData = JSON.parse(localStorage.sales);
    let i = 0;
    salesData.items.forEach(sale => {
        if (sale.product == product) {
            salesData.items.splice(i, 1);
        }
        i++;
    });
    localStorage.sales = JSON.stringify(salesData);
    window.location.replace("cart.html");
}

populateSalesTable();