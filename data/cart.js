import { getDeliveryOption } from "./deliveyOptions.js";

export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart"));
  if (!cart) {
    cart = [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        deliveryOptionId: "1",
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 2,
        deliveryOptionId: "2",
      },
    ];
  }
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) matchingItem = cartItem;
  });

  let quantity;
  if (document.getElementById(`js-selector-${productId}`) === null)
    quantity = 1;
  else
    quantity = Number(document.getElementById(`js-selector-${productId}`).value);

  if (matchingItem) matchingItem.quantity += quantity;
  else
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1",
    });

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) newCart.push(cartItem);
    cart = newCart;
  });
  saveToStorage();
}

export function updateCartQuantity(cartQuantity) {
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) matchingItem = cartItem;
  });

  if (newQuantity <= 0 || newQuantity >= 1000) {
    document.querySelector(`.js-quantity-label-${productId}`).innerHTML =
      matchingItem.quantity;
    newQuantity <= 0
      ? alert("Enter valid input")
      : alert("Quantity should be less than 1000");
    return;
  } else {
    matchingItem.quantity = newQuantity;
    document.querySelector(`.js-quantity-label-${productId}`).innerHTML =
      matchingItem.quantity;
  }
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) matchingItem = cartItem;
  });

  if(!matchingItem) return;
  
  const deliveryOption = getDeliveryOption(deliveryOptionId);
  if(!deliveryOption) return;

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
