import { cart } from "../../data/cart-class.js";
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliverydays,
} from "../../data/deliveyOptions.js";
import { products, getProducts } from "../../data/products.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";
import formatCurrency from "../utils/money.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";
  cart.cartItem.forEach((cartItem) => {
    const { productId } = cartItem;
    const matchingProduct = getProducts(productId);

    const { deliveryOptionId } = cartItem;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const deliveryDate = calculateDeliverydays(deliveryOption);

    cartSummaryHTML += `<div class="cart-item-container 
    js-cart-item-container
    js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${deliveryDate}
      </div>
  
      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">
  
        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price js-product-price-${matchingProduct.id}">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity js-product-quantity-${
            matchingProduct.id
          }">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${
                matchingProduct.id
              }">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link"
            data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${
              matchingProduct.id
            }">
              <span class="save-quantity-link link-primary js-save-quantity-link"
              data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${
              matchingProduct.id
            }" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>
  
        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
         ${deliveryOptionHTML(matchingProduct, cartItem)}      
          </div>
        </div>
      </div>
    </div>`;
  });

  //generating delivery option HTML
  function deliveryOptionHTML(matchingProduct, cartItem) {
    let HTML = "";
    deliveryOptions.forEach((deliveryOption) => {
      const deliveryDate = calculateDeliverydays(deliveryOption);
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      HTML += `
     <div class="delivery-option js-delivery-option
     js-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
     data-product-id="${matchingProduct.id}"
     data-delivery-option-id = "${deliveryOption.id}">
            <input type="radio"
              ${isChecked ? "checked" : ""}
              class="delivery-option-input
              js-delivery-option-input-${matchingProduct.id}-${
        deliveryOption.id
      }"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${deliveryDate}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
          </div>
     `;
    });
    return HTML;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  //function to delete cart item
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);

      renderCheckoutHeader();
      renderPaymentSummary();
      renderOrderSummary();
    });
  });

  //function to update the cart item quantity
  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");

      //function to save updated cart item when clicked enter
      const productQuantity = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      productQuantity.focus();
      productQuantity.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const newProductQuantity = Number(productQuantity.value);
          productQuantity.value = "";

          cart.updateQuantity(productId, newProductQuantity);
          renderCheckoutHeader();
          renderPaymentSummary();
          container.classList.remove("is-editing-quantity");
        }
      });
    });
  });

  //function to save the updated cart item when clicked on save button
  document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");

      //getting value from update qauntity field
      const productQuantity = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newProductQuantity = Number(productQuantity.value);
      productQuantity.value = "";

      cart.updateQuantity(productId, newProductQuantity);
      renderCheckoutHeader();
      renderPaymentSummary();
    });
  });

  //function to update deliverydate when clicked on delivery options
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
