import { orders } from "../data/orders.js";
import { getProducts, loadProductsFetch } from "../data/products.js";
import { cart } from "../data/cart-class.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import formatCurrency from "./utils/money.js";
import { focusOnSearchBar, loadHeader, updateCart } from "./amazonHeader.js";

loadHeader();

async function loadPage() {
  let ordersHTML = "";

  await loadProductsFetch();

  orders.forEach((order) => {
    const orderTImeString = dayjs(order.orderTIme).format("MMMM D");
    ordersHTML += `
        <div class="order-container">
          
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTImeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${loadOrders(order)}
        </div>
      </div>
        `;
  });

  function loadOrders(order) {
    let productsHTML = "";
    order.products.forEach((product) => {
      const productTimeString = dayjs(product.estimatedDeliveryTime).format(
        "MMMM DD"
      );
      const productDetails = getProducts(product.productId);
      productsHTML += `
        <div class="product-image-container">
        <img src=${productDetails.image}>
      </div>

      <div class="product-details">
        <div class="product-name">
          ${productDetails.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${productTimeString}
        </div>
        <div class="product-quantity">
          Quantity: ${product.quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again"
        data-product-id="${productDetails.id}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${productDetails.id}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
        `;
    });
    return productsHTML;
  }
  
  document.querySelector(".js-orders-grid").innerHTML = ordersHTML;

  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      cart.addToCart(button.dataset.productId);
      updateCart();

      button.innerHTML = "Added";
      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
    });
  });

  updateCart();
  focusOnSearchBar();
}

loadPage();
