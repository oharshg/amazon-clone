import { renderOrderSummary } from "./checkout/orderSummay.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { loadProductsFetch, loadProducts } from "../data/products.js";

async function loadPage() {
  try {
    await loadProductsFetch();
  } catch (error) {
    console.log("error!");
  }

  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();
