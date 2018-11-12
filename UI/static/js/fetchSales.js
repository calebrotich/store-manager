const salesAPIURI = "https://store-manager-api-v2.herokuapp.com/api/v2/saleorder";
const salesMessageBox = document.querySelector("#sales-message");
const salesRecordsContainer = document.querySelector("#sales-records-container");
const userToken = localStorage.userToken;
function fetchSales() {
    // Send GET request to category endpoint
    salesMessageBox.innerHTML = "";
    fetch(salesAPIURI, {
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
            salesMessageBox.innerHTML = response;
        }
    })
    .then(function(json_response) {
        let message = json_response.message;
        let sales = json_response.sale_orders;

        if(message === "Successfully fetched all the sale orders") {
            sales.forEach(sale => {
                let div = document.createElement("div");
                div.classList.add("sale-record");
                div.innerHTML = `
                <span>DATE: ${sale.date_ordered}</span>
                <table class="s-table">
                  <tr>
                    <th>Made by</th>
                    <th>Amount</th>
                  </tr>
                  <tr>
                    <td>${sale.made_by}</td>
                    <td>${sale.amount}</td>
                  </tr>

                </table>
                `;
                salesRecordsContainer.appendChild(div);
            });

        }
        else if (message === "No sale orders created yet") {
            salesMessageBox.innerHTML = message;
        }
        else if (json_response.Message === "You need to login" ||
                 json_response.Message === "The token is either expired or wrong") {
            window.location.replace("../../index.html");
        }
        else {
            salesMessageBox.innerHTML = message;
        }
    })
    .catch(function(err) {
        console.log(err);
        salesMessageBox.innerHTML = err;
    });
}

fetchSales();