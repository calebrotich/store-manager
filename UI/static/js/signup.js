// Power attendant's registration page
'use strict';
let apiURL = "https://store-manager-api-v2.herokuapp.com/api/v2/auth/signup";

// Collect DOM elements
let signupButton = document.querySelector("#signup-submit");
let messageBox = document.querySelector("#message-box");
let userToken = localStorage.userToken;

signupButton.addEventListener('click', (event) => {
    messageBox.innerHTML = "";
    signupButton.disabled = false;
    signupButton.value = "Creating user...";
    let signupEmail = document.querySelector("#signup-email").value;
    let signupPassword = document.querySelector("#signup-password").value;
    if(signupEmail && signupPassword) {
    event.preventDefault();

    let data = {
        "email": signupEmail,
        "password": signupPassword
    };

    // Send POST request to admin login page
    fetch(apiURL, {
        method: 'POST',
        body: JSON.stringify(data),
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
            messageBox.innerHTML = response;
        }
    })
    .then(function(json_response) {
        let message = json_response.message;
        if(message === "Account created successfully") {
            messageBox.style.color = "green";
            messageBox.innerHTML = `${message}. You can register another attendant.`;
            signupButton.value = "Add another attendant";
            signupButton.disabled = false;


        }
        else {
            messageBox.innerHTML = message;
            signupButton.value = "Add new attendant";
            signupButton.disabled = false;
        }
    })
    .catch(function(err) {
        console.log(err);
        messageBox.innerHTML = err;
    });

    } else {
        messageBox.innerHTML = "Kindly provide both the password and the email";
        signupButton.value = "Add new attendant";
    }
});