/* =========================================================
   VINTAGE VOGUE
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   WHATSAPP SETTINGS
========================================================= */

/*
   VINTAGE VOGUE WHATSAPP NUMBER

   Actual number:
   03149352550

   International format:
   923149352550

   + sign nahi lagana.
*/

const WHATSAPP_NUMBER = "923149352550";


/* =========================================================
   CART STORAGE
========================================================= */

const CART_KEY = "vintageVogueCart";

let cart = JSON.parse(
    localStorage.getItem(CART_KEY)
) || [];


/* =========================================================
   PAGE READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupMobileMenu();

        setupImageFallbacks();

        updateCartUI();

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (!menuToggle || !navLinks) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle("open");

            const isOpen =
                navLinks.classList.contains("open");


            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );


            menuToggle.textContent =
                isOpen ? "×" : "☰";

        }
    );


    /* Close menu after clicking a link */

    const links =
        navLinks.querySelectorAll("a");


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navLinks.classList.remove(
                        "open"
                    );


                    menuToggle.textContent =
                        "☰";


                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
    id,
    name,
    price,
    image
) {

    const existingProduct =
        cart.find(
            item => item.id === id
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: id,

            name: name,

            price: Number(price),

            image: image,

            quantity: 1

        });

    }


    saveCart();

    updateCartUI();

    openCart();

}


/* =========================================================
   REMOVE FROM CART
========================================================= */

function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== id
    );


    saveCart();

    updateCartUI();

}


/* =========================================================
   INCREASE QUANTITY
========================================================= */

function increaseQuantity(id) {

    const product =
        cart.find(
            item => item.id === id
        );


    if (!product) {
        return;
    }


    product.quantity += 1;


    saveCart();

    updateCartUI();

}


/* =========================================================
   DECREASE QUANTITY
========================================================= */

function decreaseQuantity(id) {

    const product =
        cart.find(
            item => item.id === id
        );


    if (!product) {
        return;
    }


    if (product.quantity > 1) {

        product.quantity -= 1;

    } else {

        removeFromCart(id);

        return;

    }


    saveCart();

    updateCartUI();

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal() {

    return cart.reduce(
        function (total, item) {

            return total +
                (
                    item.price *
                    item.quantity
                );

        },
        0
    );

}


/* =========================================================
   CART ITEM COUNT
========================================================= */

function getCartCount() {

    return cart.reduce(
        function (total, item) {

            return total +
                item.quantity;

        },
        0
    );

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(number) {

    return "Rs. " +
        Number(number)
            .toLocaleString("en-PK");

}


/* =========================================================
   UPDATE CART UI
========================================================= */

function updateCartUI() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    const cartItems =
        document.getElementById(
            "cart-items"
        );


    const cartTotal =
        document.getElementById(
            "cart-total"
        );


    /* Cart Count */

    if (cartCount) {

        cartCount.textContent =
            getCartCount();

    }


    /* Cart Total */

    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(
                getCartTotal()
            );

    }


    /* Cart Items */

    if (!cartItems) {
        return;
    }


    /* Empty Cart */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products from our collection.
                </p>

                <a
                    href="products.html"
                    class="btn btn-primary"
                    onclick="closeCart()"
                >
                    Browse Products
                </a>

            </div>

        `;

        return;
    }


    /* Render Cart Products */

    cartItems.innerHTML =
        cart.map(
            function (item) {

                return `

                    <div class="cart-item">

                        <img
                            src="${item.image}"
                            alt="${escapeHTML(item.name)}"
                            class="cart-item-image"
                            onerror="this.style.display='none'"
                        >


                        <div>

                            <h4>
                                ${escapeHTML(item.name)}
                            </h4>


                            <div class="cart-item-price">

                                ${formatPrice(item.price)}

                            </div>


                            <div class="quantity-controls">


                                <button
                                    type="button"
                                    onclick="decreaseQuantity('${item.id}')"
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>


                                <strong>
                                    ${item.quantity}
                                </strong>


                                <button
                                    type="button"
                                    onclick="increaseQuantity('${item.id}')"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>


                                <button
                                    type="button"
                                    class="remove-item"
                                    onclick="removeFromCart('${item.id}')"
                                >
                                    Remove
                                </button>


                            </div>


                            <div
                                style="
                                    margin-top:8px;
                                    font-size:13px;
                                    color:var(--muted);
                                "
                            >

                                Subtotal:
                                ${formatPrice(
                                    item.price *
                                    item.quantity
                                )}

                            </div>


                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    const drawer =
        document.getElementById(
            "cart-drawer"
        );


    const overlay =
        document.getElementById(
            "cart-overlay"
        );


    if (!drawer || !overlay) {
        return;
    }


    drawer.classList.add(
        "open"
    );


    overlay.classList.add(
        "show"
    );


    document.body.classList.add(
        "cart-open"
    );

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

    const drawer =
        document.getElementById(
            "cart-drawer"
        );


    const overlay =
        document.getElementById(
            "cart-overlay"
        );


    if (!drawer || !overlay) {
        return;
    }


    drawer.classList.remove(
        "open"
    );


    overlay.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "cart-open"
    );

}


/* =========================================================
   WHATSAPP CHECKOUT
========================================================= */

function checkoutWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add a product first."
        );

        return;

    }


    /*
       WhatsApp Order Message
    */

    let message =
        "Hello Vintage Vogue!%0A%0A" +
        "I would like to place an order:%0A%0A";


    cart.forEach(
        function (item, index) {

            const subtotal =
                item.price *
                item.quantity;


            message +=

                `${index + 1}. ` +
                `${item.name}%0A` +

                `Quantity: ` +
                `${item.quantity}%0A` +

                `Price: ` +
                `${formatPrice(item.price)}%0A` +

                `Subtotal: ` +
                `${formatPrice(subtotal)}%0A%0A`;

        }
    );


    message +=

        "--------------------%0A" +

        `Total: ` +
        `${formatPrice(getCartTotal())}%0A` +

        "--------------------%0A%0A" +

        "Please confirm my order. Thank you!";


    /*
       Direct WhatsApp Link

       Number:
       03149352550

       International:
       923149352550
    */

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}` +
        `?text=${message}`;


    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   QUICK WHATSAPP
========================================================= */

function openWhatsApp() {

    const message =
        "Hello Vintage Vogue! I would like to know more about your products.";


    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}` +
        `?text=${encodeURIComponent(message)}`;


    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

function setupImageFallbacks() {

    const images =
        document.querySelectorAll("img");


    images.forEach(
        function (img) {

            img.addEventListener(
                "error",
                function () {

                    const parent =
                        img.parentElement;


                    if (!parent) {
                        return;
                    }


                    img.style.display =
                        "none";


                    parent.classList.add(
                        "image-missing"
                    );

                }
            );

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeCart();

        }

    }
);