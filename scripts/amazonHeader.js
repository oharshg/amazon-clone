import { cart } from "../data/cart-class.js";

export function focusOnSearchBar(){
  document.body.addEventListener("keydown", (event) => {
    if (event.key === "/") {
      event.preventDefault();
      document.querySelector(".js-search-bar").focus();
      document.querySelector(".js-search-bar").value = "";
    }
  });
}

export function updateCart() {
  let cartQuantity = 0;
  cartQuantity = cart.updateCartQuantity(cartQuantity);
  document.getElementById("js-cart-quantity").innerText = cartQuantity;
}

export function loadHeader() {
  const headerHTML = `
    <div class="amazon-header-left-section">
        <a href="index.html" class="header-link">
          <img class="amazon-logo"
            src="images/amazon-logo-white.png">
          <img class="amazon-mobile-logo"
            src="images/amazon-mobile-logo-white.png">
        </a>
      </div>

      <div class="amazon-header-middle-section">
        <input class="search-bar js-search-bar" type="text" placeholder="Search ">

        <button class="search-button js-search-btn">
          <img class="search-icon" src="images/icons/search-icon.png">
        </button>
      </div>

      <div class="amazon-header-right-section">
        <a class="orders-link header-link" href="orders.html">
          <span class="returns-text">Returns</span>
          <span class="orders-text">& Orders</span>
        </a>

        <a class="cart-link header-link" href="checkout.html">
          <img class="cart-icon" src="images/icons/cart-icon.png">
          <div id="js-cart-quantity" class="cart-quantity"></div>
          <div class="cart-text">Cart</div>
        </a>
      </div>
    `;
  document.querySelector(".js-amazon-header").innerHTML = headerHTML;

  document
    .querySelector(".js-search-bar")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") searchBtn.click();
    });

  const searchBtn = document.querySelector(".js-search-btn");
  searchBtn.addEventListener("click", () => {
    const search = document.querySelector(".js-search-bar");
    const searchItem = search.value;
    search.value = "";
    window.location.href = `index.html?search=${searchItem}`;
  });
}

loadHeader();
