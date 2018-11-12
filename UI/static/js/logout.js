const logoutURI = "https://store-manager-api-v2.herokuapp.com/api/v2/auth/logout";
const logoutButton = document.querySelector("#logout-button");

// Respond to click on submit button
logoutButton.addEventListener('click', (event) => {
    event.preventDefault();

    fetch(logoutURI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userToken
        }
    })
    .then((response)=> {
        if(response.status < 500){
            return response.json()
        }
    })
    .then(function(json_response) {
        let message = json_response.message;
        if(message === "User Logged out successfully") {
            window.location.replace("../../index.html");
        }else {
            console.log("Something went wrong");
        }    
    })
    .catch(function(error) {
        console.log("Something went wrong. Try re-loading the page");
        console.log(error);
    });
});