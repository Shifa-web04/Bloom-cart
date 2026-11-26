// ========================================
// BLOOMCART - JAVASCRIPT
// ========================================


// ========================================
// 1. PRODUCT DATA
// ========================================

const products = [
    {
        id: 1,
        name: "Blushing Roses",
        category: "Roses",
        price: 2500,
        rating: 4.9,
        tag: "Bestseller",
        image: "assets/images/pink roses.jpg"
    },
    {
        id: 2,
        name: "Pretty Pink Tulips",
        category: "Tulips",
        price: 3200,
        rating: 4.8,
        tag: "Popular",
        image: "assets/images/pink tulips.jpg"
    },
    {
        id: 3,
        name: "Sweetheart Bouquet",
        category: "Bouquets",
        price: 4500,
        rating: 5.0,
        tag: "Special",
        image: "assets/images/lily flower bouqet.jpg"
    },
    {
        id: 4,
        name: "Dreamy Flower Box",
        category: "Gifts",
        price: 3800,
        rating: 4.7,
        tag: "New",
        image: "assets/images/flower gift box.jpg"
    },
    {
        id: 5,
        name: "Classic Red Roses",
        category: "Roses",
        price: 2800,
        rating: 4.9,
        tag: "Favourite",
        image: "assets/images/red roses.jpg"
    },
    {
        id: 6,
        name: "Sunshine Tulips",
        category: "Tulips",
        price: 3000,
        rating: 4.8,
        tag: "Fresh",
        image: "assets/images/sunshine tulips.jpg"
    },
    {
        id: 7,
        name: "Pastel Garden Mix",
        category: "Bouquets",
        price: 4200,
        rating: 4.9,
        tag: "Trending",
        image: "assets/images/pastel flowers.jpg"
    },
    {
        id: 8,
        name: "Little Gift Surprise",
        category: "Gifts",
        price: 3500,
        rating: 4.8,
        tag: "Gift Pick",
        image: "assets/images/lil gift surprise.jpg"
    }
];


// ========================================
// 2. SELECT HTML ELEMENTS
// ========================================

const productGrid = document.getElementById("productGrid");

const filterButtons = document.querySelectorAll(".filter-btn");

const categoryCards = document.querySelectorAll(".category-card");

const searchToggle = document.getElementById("searchToggle");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const cartToggle = document.getElementById("cartToggle");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMessage = document.getElementById("newsletterMessage");


// ========================================
// 3. PRODUCT DISPLAY
// ========================================

function displayProducts(productList) {

    if (productList.length === 0) {
        productGrid.innerHTML = `
            <p class="no-products">
                Oops! No flowers found. Try another search. 🌷
            </p>
        `;
        return;
    }

    productGrid.innerHTML = productList.map(product => {

        return `
            <article class="product-card">

                <div class="product-image">

                    <img 
                        src="${product.image}" 
                        alt="${product.name}"
                        loading="lazy"
                    >

                    <span class="product-tag">
                        ${product.tag}
                    </span>

                </div>

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <div class="product-rating">
                        ★★★★★
                        <span>(${product.rating})</span>
                    </div>

                    <p class="product-price">
                        Rs. ${product.price.toLocaleString("en-PK")}
                    </p>

                    <button 
                        class="add-cart-btn"
                        data-id="${product.id}"
                    >
                        Add to Basket 🛍️
                    </button>

                </div>

            </article>
        `;

    }).join("");

}


// Display all products initially

displayProducts(products);


// ========================================
// 4. CATEGORY FILTERS
// ========================================

function filterProducts(category) {

    const filteredProducts = category === "All"
        ? products
        : products.filter(product => product.category === category);

    displayProducts(filteredProducts);

    filterButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === category
        );

    });

}


// Filter button clicks

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category = button.dataset.filter;

        searchInput.value = "";

        filterProducts(category);

    });

});


// Category card clicks

categoryCards.forEach(card => {

    card.addEventListener("click", () => {

        const category = card.dataset.category;

        filterProducts(category);

        document.getElementById("shop").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// ========================================
// 5. SEARCH FUNCTIONALITY
// ========================================

searchToggle.addEventListener("click", () => {

    searchContainer.classList.toggle("active");

    if (searchContainer.classList.contains("active")) {
        searchInput.focus();
    }

});


searchInput.addEventListener("input", () => {

    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );

    });

    filterButtons.forEach(button => {
        button.classList.remove("active");
    });

    displayProducts(filteredProducts);

});


// ========================================
// 6. MOBILE NAVIGATION
// ========================================

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    menuToggle.textContent =
        navLinks.classList.contains("active") ? "✕" : "☰";

});


// Close mobile navigation after clicking a link

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";

    });

});


// ========================================
// 7. SHOPPING CART
// ========================================

let cart = [];


// Add products to cart

productGrid.addEventListener("click", (event) => {

    const button = event.target.closest(".add-cart-btn");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const selectedProduct = products.find(
        product => product.id === productId
    );

    if (!selectedProduct) return;

    const existingProduct = cart.find(
        item => item.id === productId
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...selectedProduct,
            quantity: 1
        });

    }

    updateCart();

    button.textContent = "Added! 💗";

    setTimeout(() => {
        button.textContent = "Add to Basket 🛍️";
    }, 1000);

});


// ========================================
// 8. UPDATE CART
// ========================================

function updateCart() {

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {

        totalItems += item.quantity;

        totalPrice += item.price * item.quantity;

    });


    // Update cart badge

    cartCount.textContent = totalItems;


    // Update cart total

    cartTotal.textContent =
        "Rs. " + totalPrice.toLocaleString("en-PK");


    // Empty cart message

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your basket is waiting for something lovely! 🌷
            </p>
        `;

        return;
    }


    // Display cart items

    cartItems.innerHTML = cart.map(item => {

        return `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-info">

                    <h4>${item.name}</h4>

                    <p>
                        Rs. ${item.price.toLocaleString("en-PK")}
                    </p>

                    <p>
                        Quantity: ${item.quantity}
                    </p>

                </div>

                <button
                    class="remove-cart-item"
                    data-id="${item.id}"
                    aria-label="Remove ${item.name}"
                    title="Remove item"
                >
                    ×
                </button>

            </div>
        `;

    }).join("");

}


// ========================================
// 9. REMOVE CART ITEMS
// ========================================

cartItems.addEventListener("click", (event) => {

    const button = event.target.closest(".remove-cart-item");

    if (!button) return;

    const productId = Number(button.dataset.id);

    cart = cart.filter(item => item.id !== productId);

    updateCart();

});


// ========================================
// 10. OPEN AND CLOSE CART
// ========================================

function openCart() {

    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


function hideCart() {

    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


cartToggle.addEventListener("click", openCart);

closeCart.addEventListener("click", hideCart);

cartOverlay.addEventListener("click", hideCart);


// Close cart with Escape key

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        hideCart();

        searchContainer.classList.remove("active");

        navLinks.classList.remove("active");

        menuToggle.textContent = "☰";

    }

});


// ========================================
// 11. CHECKOUT DEMO
// ========================================

checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your basket is empty! Add something lovely first. 🌷");

        return;
    }

    alert(
        "Thank you for shopping with BloomCart! 💗\n\n" +
        "Your order total is " + cartTotal.textContent +
        "\n\nThis is a demo checkout. No payment has been processed."
    );

});


// ========================================
// 12. NEWSLETTER
// ========================================

newsletterForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = newsletterEmail.value.trim();

    if (!email) {

        newsletterMessage.textContent =
            "Please enter your email address. 💌";

        return;
    }

    newsletterMessage.textContent =
        "Yay! You're now part of our Bloom Club! 🌸";

    newsletterMessage.style.color = "#71866a";

    newsletterForm.reset();

});


// ========================================
// 13. INITIAL CART DISPLAY
// ========================================

updateCart();

console.log("🌸 BloomCart JavaScript loaded successfully!");