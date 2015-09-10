
// creating a new dish 
var addNewDishButton = document.getElementById("addNewDish");
addNewDishButton.addEventListener("click", function() {
    var newName = document.getElementById("newDishName");
    var newImage_url = document.getElementById("newDishImage_url");
    var newPrice = document.getElementById("newDishPrice");
    var newCategory_id = document.getElementById("category_id");

// validationg all the field of creating a dish 
    if (newName.value === '' && newPrice.value === '') {
        alert("Please enter a valid dish name and dish price")
        return;
    } else if (newName.value === '') {
        alert("Please enter a valid dish name")
        return;
    } else if (newPrice.value === '') {
        alert("Please enter a valid dish price")
        return;
    } else if (newPrice.value < 1) {
        alert("The price has to be greater than or equal to $1")
        return;
    } else if (newCategory_id.value === '') {
        alert("The enter a category number")
        return;
    }

// posting the created dish via ajax call
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/dishes");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        var returnedDish = JSON.parse(xhr.response);
        showDish(returnedDish);
        newName.value = "";
        newImage_url.value = "";
        newPrice.value = "";
        newCategory_id.value = "";
    });

    var newDish = {
        name: newName.value,
        image_url: newImage_url.value,
        price: newPrice.value,
        category_id: newCategory_id.value
    }
    xhr.send(JSON.stringify(newDish));
})

// creating li for created dish
var createLiForDish = function(li, dish) {
    li.innerHTML = "";
    li.setAttribute("id", "dish" + dish.id);
    var dishText = dish.name + "  $" + dish.price;
    var dishTextNode = document.createTextNode(dishText);


    var spanForText = document.createElement("span");
    spanForText.appendChild(dishTextNode);
    spanForText.setAttribute("style", "margin:10px;");
    li.appendChild(spanForText);


// creating img for dish
    var dishImg = document.createElement("img");
    dishImg.setAttribute('src', dish.image_url);
    li.appendChild(dishImg);

    // creating a line break between the image and edit/delete button
    var br = document.createElement("br")
    li.appendChild(br)

// edit button
    var editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", function() {
        editDish(li, dish.name, dish.image_url, dish.price, dish.category_id);
    });
    li.appendChild(editButton);

// creating delete button
    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteDish);

    li.appendChild(deleteButton);
}

// to show individual dish
var showDish = function(dish) {
    var li = document.createElement("li");
    createLiForDish(li, dish);
    var ul = document.getElementById("dishesList");
    ul.appendChild(li);
};

// to show all the dishes
var showAllDishes = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/dishes");
    xhr.addEventListener("load", function() {
        var dishes = JSON.parse(xhr.response);
        dishes.forEach(function(dish) {
            showDish(dish);
        });
    });
    xhr.send();
}
var editDish = function(li, name, image_url, price, category_id) {
    li.innerHTML = "";
    var id = li.id.substring(4);

    var nameField = document.createElement("input");
    nameField.setAttribute("type", "text");
    nameField.value = name;
    li.appendChild(nameField);


    var image_urlField = document.createElement("input");
    image_urlField.setAttribute("type", "text");
    image_urlField.value = image_url;
    li.appendChild(image_urlField);

    var priceField = document.createElement("input");
    priceField.setAttribute("type", "text");
    priceField.value = price;
    li.appendChild(priceField);

    var category_idField = document.createElement("input");
    category_idField.setAttribute("type", "text");
    category_idField.value = category_id;
    li.appendChild(category_idField);


    var updateButton = document.createElement("button");
    updateButton.innerText = "Update";
    updateButton.addEventListener("click", function() {
        var newName = nameField.value;
        var newImage_url = image_urlField.value;
        var newPrice = priceField.value;
        var newCategory_id = category_idField.value;
        updateDish(li, newName, newImage_url, newPrice, newCategory_id);
    });
    li.appendChild(updateButton);
};

var updateDish = function(li, newName, newImage_url, newPrice, newCategory_id) {

    var id = li.id.substring(4);

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:3000/dish/" + id);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        var returnedDish = JSON.parse(xhr.response);
        alert(xhr.response)
        createLiForDish(li, returnedDish);
    });

    var updatedDish = {
            name: newName,
            image_url: newImage_url,
            price: newPrice,
            category_id: newCategory_id
        }
        //alert(JSON.stringify(updatedDish));
    xhr.send(JSON.stringify(updatedDish));
};

var deleteDish = function() {
    var li = this.parentNode;
    var id = li.id.substring(4);

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:3000/dish/" + id);
    xhr.addEventListener("load", function() {
        if (JSON.parse(xhr.responseText).deleted === true) {
            li.remove();
        }
    });

    xhr.send();
}

///////////////////////////////////////////////////////////
// ************** category starts here ********************


var addNewCategoryButton = document.getElementById("addNewCategory");
addNewCategoryButton.addEventListener("click", function() {
    var newName = document.getElementById("newCategoryName");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/categories");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        var returnedCategory = JSON.parse(xhr.response);
        showCategory(returnedCategory);
        newName.value = "";

    });

    var newCategory = {
        name: newName.value,

    }
    xhr.send(JSON.stringify(newCategory));
})


var createLiForCategory = function(li, category) {
    li.innerHTML = "";
    li.setAttribute("id", "category" + category.id);
    var categoryText = category.id + "  " + category.name;
    var categoryTextNode = document.createTextNode(categoryText);

    var link = document.createElement("a");
    link.setAttribute("id", "/category/" + category.id);
    link.innerText = categoryText;
    li.appendChild(link)


    link.addEventListener("click", function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/category/" + category.id);
        xhr.addEventListener("load", function() {
            var returnedCategory = JSON.parse(xhr.response)
            console.log(returnedCategory)
            
            var div = document.getElementById("categoriesList");
                div.innerHTML = "";
            var i = 0; 
            while(i < returnedCategory.length) {
                var li2 = document.createElement("li");
                li2.innerText = returnedCategory[i].name;
                console.log(returnedCategory[i].name);
                i = i + 1;
                createLiForCategory(li, category);
                div.appendChild(li2)
            }
        })
        xhr.send();
    });


    var br = document.createElement("br")
    li.appendChild(br)

    // var spanForText = document.createElement("span");
    // spanForText.appendChild(categoryTextNode);
    // spanForText.setAttribute("style", "margin:10px;");
    // li.appendChild(spanForText);


    var editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", function() {
        editCategory(li, category.name);
    });
    li.appendChild(editButton);

    var deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteCategory);

    li.appendChild(deleteButton);
};


var showAllCategories = function() {
    console.log("Works - line 206")
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/categories");
    xhr.addEventListener("load", function() {
        var categories = JSON.parse(xhr.response);
        categories.forEach(function(category) {
            showCategory(category)
        });
    });
    xhr.send();
}

var showCategory = function(category) {
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/category/" + category.id);
    xhr.addEventListener("load", function() {
        var li = document.createElement("li");
        createLiForCategory(li, category);
        var ul = document.getElementById("categoriesList");
        ul.appendChild(li);
    });
    xhr.send();
};


var editCategory = function(li, name) {
    li.innerHTML = "";
    var id = li.id.substring(8);

    var nameField = document.createElement("input");
    nameField.setAttribute("type", "text");
    nameField.value = name;
    li.appendChild(nameField);


    var updateButton = document.createElement("button");
    updateButton.innerText = "Update";
    updateButton.addEventListener("click", function() {
        var newName = nameField.value;
        updateCategory(li, newName);
    });
    li.appendChild(updateButton);
};

var updateCategory = function(li, newName) {

    var id = li.id.substring(8);

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:3000/category/" + id);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        var returnedCategory = JSON.parse(xhr.response);
        alert(xhr.response)
        createLiForCategory(li, returnedCategory);
    });

    var updatedCategory = {
        name: newName,
    }

    xhr.send(JSON.stringify(updatedCategory));
};

var deleteCategory = function() {
    var li = this.parentNode;
    var id = li.id.substring(8);

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:3000/category/" + id);
    xhr.addEventListener("load", function() {
        if (JSON.parse(xhr.responseText).deleted === true) {
            li.remove();
        }
    });

    xhr.send();
}

showAllDishes();

showAllCategories();