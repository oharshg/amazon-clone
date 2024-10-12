import { getDeliveryOption } from "./deliveyOptions.js";

function Cart(localStorageKey) {
  const cart = {
    cartItem: undefined,

    loadFromStorage() {
      this.cartItem = JSON.parse(localStorage.getItem(localStorageKey));
      if (!this.cartItem) {
        this.cartItem = [
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
    },

    saveToStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cartItem));
    },

    addToCart(productId) {
      let matchingItem;

      this.cartItem.forEach((cartItem) => {
        if (productId === cartItem.productId) matchingItem = cartItem;
      });

      let quantity;
      if (document.getElementById(`js-selector-${productId}`) === null)
        quantity = 1;
      else
        quantity = Number(
          document.getElementById(`js-selector-${productId}`).value
        );

      if (matchingItem) matchingItem.quantity += quantity;
      else
        this.cartItem.push({
          productId: productId,
          quantity: quantity,
          deliveryOptions: "1",
        });

      this.saveToStorage();
    },

    removeFromCart(productId) {
      const newCart = [];

      this.cartItem.forEach((cartItem) => {
        if (cartItem.productId !== productId) newCart.push(cartItem);
        this.cartItem = newCart;
      });
      this.saveToStorage();
    },

    updateCartQuantity(cartQuantity) {
      this.cartItem.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });
      return cartQuantity;
    },

    updateQuantity(productId, newQuantity) {
      let matchingItem;
      this.cartItem.forEach((cartItem) => {
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
      this.saveToStorage();
    },

    updateDeliveryOption(productId, deliveryOptionId) {
      let matchingItem;

      this.cartItem.forEach((cartItem) => {
        if (productId === cartItem.productId) matchingItem = cartItem;
      });

      if (!matchingItem) return;

      const deliveryOption = getDeliveryOption(deliveryOptionId);
      if (!deliveryOption) return;

      matchingItem.deliveryOptionId = deliveryOptionId;
      this.saveToStorage();
    },
  };
  return cart;
}

const cart = Cart('cart-oop');
const businessCart = Cart('cart-business');

cart.loadFromStorage();
businessCart.loadFromStorage();

cart.addToCart("83d4ca15-0f35-48f5-b7a3-1ea210004f2e");
console.log(cart);
console.log(businessCart);