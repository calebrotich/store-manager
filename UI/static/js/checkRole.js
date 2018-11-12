// Check login and role
function redirectIfNotLoggedIn() {
    if(localStorage.role == undefined) {
        window.location.replace("../../index.html");
    }
}

function redirectIfNotAdmin() {
    if (localStorage.role != "admin") {
        window.location.replace("products.html");
    }
}

redirectIfNotLoggedIn();