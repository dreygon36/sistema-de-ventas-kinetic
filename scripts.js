const CART_KEY = 'kineticCart';

function toggleMenu(){
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function getCart(){
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.textContent = totalCount;
  badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
}

function addProductFromButton(button){
  const product = {
    id: button.dataset.id,
    name: button.dataset.name,
    price: parseFloat(button.dataset.price) || 0,
    quantity: 1
  };
  addToCart(product);
}

function addToCart(product){
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  saveCart(cart);
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => alert(`${product.name} agregado al carrito`));
  } else {
    alert(`${product.name} agregado al carrito`);
  }
  renderCartPage();
}

function formatCurrency(value){
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function initCartPage(){
  if (document.getElementById('cart-container')) {
    renderCartPage();
  }
}

function renderCartPage(){
  const container = document.getElementById('cart-container');
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>No hay productos en el carrito.</p>
        <a class="button" href="productos.html">Seguir comprando</a>
      </div>
    `;
    return;
  }

  const rows = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    return `
      <tr>
        <td>${item.name}</td>
        <td>${formatCurrency(item.price)}</td>
        <td>
          <button class="quantity-button" onclick="changeQuantity('${item.id}', -1)">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-button" onclick="changeQuantity('${item.id}', 1)">+</button>
        </td>
        <td>${formatCurrency(itemTotal)}</td>
        <td><button class="remove-button" onclick="removeFromCart('${item.id}')">Eliminar</button></td>
      </tr>
    `;
  }).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  container.innerHTML = `
    <div class="cart-table-wrapper">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio unitario</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="cart-summary">
        <div class="cart-summary-item"><strong>Subtotal:</strong> ${formatCurrency(total)}</div>
      </div>
    </div>
  `;
}

function removeFromCart(id){
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  renderCartPage();
}

function changeQuantity(id, delta){
  const cart = getCart();
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart(cart);
  renderCartPage();
}

window.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initCartPage();
});