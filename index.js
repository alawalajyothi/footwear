/*search box*/

function searchfoot(){
let input =
document.getElementById("search-input").value.toLowerCase();
let product = 
document.querySelectorAll(".product");
product.forEach (function(product){
    let productName = product.querySelector("h3").textContent.toLowerCase();
    if (productName.includes(input)){
        product.style.display="block";
    }else{
        product.style.display = "none";
    }

});
}

/*add to cart*/

/*let totalitems = 0 ;
let buttons = document.querySelectorAll(".btn");
    buttons.forEach(function(button){
    button.addEventListener("click",function(){
         totalitems ++;
        document.getElementById("count").textContent = totalitems;

    }

);
});*/


let showdetails = document.querySelectorAll(".details");

showdetails.forEach(function(button) {
    button.addEventListener("click", function() {
        let product = button.parentElement;
        let info = product.querySelector(".product-info");

        if (!info) {
            console.log("Product info paragraph not found!");
            return;
        }

        if (getComputedStyle(info).display === "none") {
            info.style.display = "block";
            button.textContent = "Hide Details";
        } else {
            info.style.display = "none";
            button.textContent = "Show Details";
        }
    });
});
 
   
// ADD TO CART USING LOCAL STORAGE

const CART_KEY = "footwalkCart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
    const countElement = document.getElementById("count");

    if (countElement) {
        const cart = getCart();
        countElement.textContent = cart.reduce(
            (total, item) => total + item.quantity, 0
        );
    }
}

document.querySelectorAll(".product").forEach((product) => {

    const button = product.querySelector(".btn");

    if (!button) return;

    button.addEventListener("click", () => {

        const name = product.querySelector("h3").innerText;
        const priceText = product.querySelector(".price").innerText;
        const price = Number(priceText.replace(/[^\d.]/g, ""));
        const image = product.querySelector("img").getAttribute("src");

        let cart = getCart();

        const existingProduct = cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }

        saveCart(cart);
        updateCartCount();

        alert(name + " added to cart!");
    });

});

updateCartCount();

/*let cart = [];

document.querySelectorAll(".product").forEach((product) => {

    let button = product.querySelector(".btn");

    button.addEventListener("click", () => {

        let name = product.querySelector("h3").innerText;
        let price = product.querySelector(".price").innerText;

        cart.push({
            name: name,
            price: price
        });

        document.getElementById("count").innerText = cart.length;

        console.log("Cart Products:", cart);

    });

});*/

document.querySelectorAll(".like-btn").forEach((button) => {

    button.addEventListener("click", () => {

        button.classList.toggle("liked");

        if (button.classList.contains("liked")) {
            button.innerText = "♥";
        } else {
            button.innerText = "♡";
        }

    });

});


document.querySelectorAll(".share-btn").forEach(button => {

    button.addEventListener("click", async () => {

        const product = button.closest(".product");
        const name = product.querySelector("h3").innerText;

        try {
            await navigator.share({
                title: name,
                text: "Check out this footwear!",
                url: window.location.href
            });
        } catch (error) {
            console.log("Sharing cancelled or unavailable");
        }

    });

});



/* DISPLAY PRODUCTS IN CART PAGE */

function displayCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    // Run only on cart page
    if (!cartContainer || !totalElement) return;

    let cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty!</p>";
        totalElement.textContent = "Total: $0";
        return;
    }

    let total = 0;

    cartContainer.innerHTML = cart.map((item, index) => {
        total += item.price * item.quantity;

        return `
            <div class="cart-product">
                <img src="${item.image}" width="100">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>

                <button data-action="decrease" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button data-action="increase" data-index="${index}">+</button>

                <button data-action="remove" data-index="${index}">
                    Remove
                </button>
            </div>
            <hr>
        `;
    }).join("");

    totalElement.textContent = "Total: $" + total;
}

// Cart quantity and remove buttons
const cartContainer = document.getElementById("cart-items");

if (cartContainer) {
    cartContainer.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        let cart = getCart();
        const index = Number(button.dataset.index);
        const action = button.dataset.action;

        if (!cart[index]) return;

        if (action === "increase") {
            cart[index].quantity++;
        }

        if (action === "decrease") {
            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        if (action === "remove") {
            cart.splice(index, 1);
        }

        saveCart(cart);
        displayCart();
        updateCartCount();
    });
}

// Clear entire cart
const clearButton = document.getElementById("clear-cart");

if (clearButton) {
    clearButton.addEventListener("click", () => {
        localStorage.removeItem(CART_KEY);
        displayCart();
        updateCartCount();
    });
}

displayCart();




/* PLACE ORDER FUNCTIONALITY */

const orderButton = document.getElementById("place-order");

if (orderButton) {
    orderButton.addEventListener("click", () => {

        let cart = getCart();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const total = cart.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

        const order = {
            orderId: "FW" + Date.now(),
            products: cart,
            total: total,
            orderDate: new Date().toLocaleString(),
            status: "Order Placed"
        };

        let orders = JSON.parse(
            localStorage.getItem("footwalkOrders")
        ) || [];

        orders.push(order);

        localStorage.setItem(
            "footwalkOrders",
            JSON.stringify(orders)
        );

        alert(
            "Order placed successfully!\n" +
            "Order ID: " + order.orderId +
            "\nTotal: $" + total
        );

        localStorage.removeItem("footwalkCart");

        displayCart();
        updateCartCount();
    });
}

