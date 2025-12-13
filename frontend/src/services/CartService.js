// cartService.js
import { ref } from "vue";

const CART_KEY = "cart";
const cart = ref(JSON.parse(localStorage.getItem(CART_KEY)) || []);

// fonction pour mettre à jour le localStorage
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart.value));
}

export default {
  getCart: () => cart.value,
  getCartRef: () => cart, // expose le ref pour les computed
  getCartLength: () => cart.value.reduce((total, item) => total + item.quantity, 0),

  addToCart(product) {
    const existing = cart.value.find(p => p.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1
      });
    }
    saveCart();
  }
};
