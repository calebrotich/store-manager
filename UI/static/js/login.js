// Power up login
'use strict';
let api_url = "https://store-manager-api-v2.herokuapp.com/api/v2/auth/login";
let login_button = document.getElementById('submit-login');
let message_box = document.getElementById('message-box');

// Respond to click on submit button
login_button.addEventListener('click', (event) => {
    event.preventDefault();
    // Collect the necessary DOM elements
    let login_email = document.getElementById('login-email').value;
    let login_password = document.getElementById('login-password').value;

    message_box.innerHTML = "";
    login_button.value = "Processing...";
    login_button.disabled = true;

    let data = {
        "email": login_email,
        "password": login_password
    };

    fetch(api_url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response)=> {
        if(response.status < 500){
            return response.json()
        }
        else{
            message_box.innerHTML = response;
        }
    })
    .then(function(json_response) {
        let message = json_response.message;
        if(message === "Login successful") {
            // Store user_token in localStorage
            localStorage.userToken = json_response.token;
            localStorage.role = json_response.role;
            // Redirect to orders page
            window.location.replace("UI/templates/products.html");

        }else {
            message_box.innerHTML = message;
            login_button.value = "Login";
            login_button.disabled = false;
        }
        
    })
    .catch(function(error) {
        message_box.innerHTML = "Something went wrong. Try re-loading the page";
        console.log(error);
    });
});