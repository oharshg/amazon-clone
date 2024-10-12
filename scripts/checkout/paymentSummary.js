import { cart } from "../../data/cart-class.js";
import { getProducts } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveyOptions.js";
import formatCurrency from "../utils/money.js";
import { addOrders } from "../../data/orders.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let ShippingPriceCents = 0;
  let cartQuantity = 0;

  cart.cartItem.forEach((cartItem) => {
    const product = getProducts(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    ShippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTaxCents = productPriceCents + ShippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totatCents = totalBeforeTaxCents + taxCents;

  cartQuantity = cart.updateCartQuantity(cartQuantity);

  const paymentSummaryHTML = `
  <div class="payment-summary-title"> Order Summary</div>

    <div class="payment-summary-row">
    <div class="js-payment-quantity">Items (${cartQuantity}):</div>
    <div class="payment-summary-money js-payment-summary-money">$${formatCurrency(
      productPriceCents
    )}</div>
    </div>

    <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money js-payment-summary-shipping">$${formatCurrency(
      ShippingPriceCents
    )}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${formatCurrency(
      totalBeforeTaxCents
    )}</div>
    </div>

    <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money js-payment-summary-total">$${formatCurrency(
      totatCents
    )}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
    Place your order
    </button>
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  document
    .querySelector(".js-place-order")
    .addEventListener("click", async () => {
      try {
        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            cart: cart.cartItem,
          }),
        });
        const order = await response.json();
        addOrders(order);
      } catch (error) {
        console.log("Unexpected Error , try again later");
      }
      cart.resetCart();
      window.location.href = "orders.html";
    });
}
