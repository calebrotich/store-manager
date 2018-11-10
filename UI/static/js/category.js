// Power categories
const categoryAPIURI = "https://store-manager-api-v2.herokuapp.com/api/v2/category";
const categoryButton = document.querySelector("#submit-category");
const CategoryMessageBox = document.querySelector("#category-message");
let userToken = localStorage.userToken;

categoryButton.addEventListener('click', (event) => {
    CategoryMessageBox.innerHTML = "";
    categoryButton.disabled = true;
    categoryButton.value = "Creating category...";
    const categoryName = document.querySelector("#add-category-name").value;
    if(categoryName) {
        event.preventDefault();

        let CategoryData = {
            "category_name": categoryName
        };

        // Send POST request to category endpoint
        fetch(categoryAPIURI, {
            method: 'POST',
            body: JSON.stringify(CategoryData),
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
                CategoryMessageBox.innerHTML = response;
            }
        })
        .then(function(json_response) {
            let message = json_response.message;
            if(message === "Category created successfully") {
                CategoryMessageBox.style.color = "green";
                CategoryMessageBox.innerHTML = `${message}. You can now create another category.`;
                categoryButton.value = "Add another category";
                categoryButton.disabled = false;
            }
            else {
                CategoryMessageBox.innerHTML = message;
                categoryButton.value = "Add category";
                categoryButton.disabled = false;
            }
        })
        .catch(function(err) {
            console.log(err);
            CategoryMessageBox.innerHTML = err;
            categoryButton.disabled = false;
        });

    } else {
        CategoryMessageBox.innerHTML = "Kindly provide a category name";
        categoryButton.value = "Add category";
    }
});