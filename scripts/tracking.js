import { loadProductsFetch, getProducts } from "../data/products.js";
import { getOrders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { cart } from "../data/cart-class.js";
import { focusOnSearchBar, loadHeader, updateCart } from "./amazonHeader.js";

loadHeader();

async function loadPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  const productDetails = getProducts(productId);
  const orderDetails = getOrders(orderId);

  let matchingProduct;
  orderDetails.products.forEach((product) => {
    if (product.productId === productId) matchingProduct = product;
  });

  const currentTime = dayjs();
  const orderTime = dayjs(orderDetails.orderTime);
  const deliveryTime = dayjs(matchingProduct.estimatedDeliveryTime);
  const percentProgress =
    ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100;
  const deliveryMssg =
    currentTime > deliveryTime ? "Delivered on" : "Arriving on";

  const trackingHTML = `
  <div class="order-tracking">
  <a class="back-to-orders-link link-primary" href="orders.html">
    View all orders
  </a>

  <div class="delivery-date">
    ${deliveryMssg} ${dayjs(matchingProduct.estimatedDeliveryTime).format(
    "dddd, MMMM D"
  )}
  </div>

  <div class="product-info">
    ${productDetails.name}
  </div>

  <div class="product-info">
    Quantity: ${matchingProduct.quantity}
  </div>

  <img class="product-image" src=${productDetails.image}>

  <div class="progress-labels-container">
    <div class="progress-label ${percentProgress < 50 ? "current-status" : ""}">
      Preparing
    </div>
    <div class="progress-label ${
      percentProgress > 50 && percentProgress < 100 ? "current-status" : ""
    }">
      Shipped
    </div>
    <div class="progress-label ${
      percentProgress >= 100 ? "current-status" : ""
    }">
      Delivered
    </div>
  </div>

  <div class="progress-bar-container">
    <div class="progress-bar" style="width : ${percentProgress}% "></div>
  </div>
</div>`;

  document.querySelector(".main").innerHTML = trackingHTML;

  updateCart();
  focusOnSearchBar();
}

loadPage();
