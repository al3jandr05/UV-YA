let cart = [];
const MAX_ITEMS = 5;
const MIN_TOTAL = 10;
let qrConfirmed = false; // Variable para controlar si ya se confirmó el pago por QR

// Display the cart modal
document.getElementById('cart-button').addEventListener('click', function() {
    document.getElementById('cart-modal').style.display = 'block';
});

// Close the cart modal
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('cart-modal').style.display = 'none';
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == document.getElementById('cart-modal')) {
        document.getElementById('cart-modal').style.display = 'none';
    }
};

// Show notification when a product is added
function showNotification(message) {
    const notification = document.getElementById('add-to-cart-notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);  // Hide after 2 seconds
}

// Show order status notifications
function showOrderStatusNotification(message) {
    const statusNotification = document.getElementById('order-status-notification');
    statusNotification.textContent = message;
    statusNotification.classList.add('show');

    setTimeout(() => {
        statusNotification.classList.remove('show');
    }, 4000);  // Hide after 4 seconds
}

// Show QR payment modal
function showQRPaymentModal() {
    const qrModal = document.getElementById('qr-payment-modal');
    qrModal.style.display = 'block';

    document.querySelector('.close-qr').addEventListener('click', function() {
        qrModal.style.display = 'none';
    });

    document.getElementById('confirm-payment-button').addEventListener('click', function() {
        const receipt = document.getElementById('payment-receipt').files[0];
        if (!receipt) {
            alert('Por favor, sube el comprobante de pago.');
            return;
        }

        // Cierra el modal del QR después de subir el comprobante
        qrModal.style.display = 'none';
        qrConfirmed = true;  // Marca que el pago por QR fue confirmado
        document.getElementById('cart-modal').style.display = 'block';  // Regresa al modal del carrito
    });
}

// Add to cart and check the total quantity limit
function addToCart(item, price) {
    const totalItems = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

    if (totalItems >= MAX_ITEMS) {
        showWarningModal('No puedes añadir más de 5 productos al carrito.');
        return;
    }

    const existingItem = cart.find(cartItem => cartItem.item === item);
    if (existingItem) {
        if (totalItems + 1 > MAX_ITEMS) {
            showWarningModal('No puedes añadir más de 5 productos al carrito.');
            return;
        }
        existingItem.quantity += 1;
    } else {
        if (totalItems + 1 > MAX_ITEMS) {
            showWarningModal('No puedes añadir más de 5 productos al carrito.');
            return;
        }
        cart.push({ item, price, quantity: 1 });
    }

    updateCart();
    showNotification('Producto añadido al carrito!');
}

// Update the cart count and display
function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    cart.forEach(orderItem => {
        total += orderItem.price * orderItem.quantity;
        itemCount += orderItem.quantity;

        const div = document.createElement('div');
        div.innerHTML = `
            <p>${orderItem.item} - ${orderItem.price} Bs x ${orderItem.quantity}</p>
            <button onclick="removeFromCart('${orderItem.item}')">Eliminar</button>
            <button onclick="changeQuantity('${orderItem.item}', 1)">Añadir</button>
            <button onclick="changeQuantity('${orderItem.item}', -1)">Reducir</button>
        `;
        cartItemsDiv.appendChild(div);
    });

    document.getElementById('order-total-modal').textContent = `Total: ${total} Bs`;
    document.getElementById('cart-count').textContent = itemCount;  // Update cart count
}

// Remove item from cart
function removeFromCart(item) {
    cart = cart.filter(cartItem => cartItem.item !== item);
    updateCart();
}

// Change quantity of items in the cart with total limit check
function changeQuantity(item, amount) {
    const cartItem = cart.find(cartItem => cartItem.item === item);
    if (cartItem) {
        const totalItems = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
        if (amount > 0 && totalItems >= MAX_ITEMS) {
            showWarningModal('No puedes añadir más de 5 productos al carrito.');
            return;
        }
        cartItem.quantity += amount;
        if (cartItem.quantity <= 0) {
            removeFromCart(item);
        } else {
            updateCart();
        }
    }
}

// Place order with minimum total check
function placeOrder() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (total < MIN_TOTAL) {
        showWarningModal(`El pedido debe ser de al menos ${MIN_TOTAL} Bs para continuar.`);
        return;
    }

    const method = document.querySelector('input[name="payment-method"]:checked').value;

    if (method === 'qr' && !qrConfirmed) {
        showQRPaymentModal();  // Muestra el modal para el pago por QR
    } else {
        // Si ya se confirmó el QR o es efectivo, cierra el modal del carrito y empieza el estado del pedido
        document.getElementById('cart-modal').style.display = 'none';
        startOrderStatusUpdates();
        emptyCart();  // Vacía el carrito al confirmar el pedido
        qrConfirmed = false;  // Reinicia el estado de la confirmación QR
    }
}

// Vacía el carrito después de confirmar el pedido
function emptyCart() {
    cart = [];
    updateCart();  // Actualiza la interfaz para reflejar el carrito vacío
}

// Simulate order status updates
function startOrderStatusUpdates() {
    showOrderStatusNotification('Preparando tu pedido...');
    setTimeout(() => {
        showOrderStatusNotification('Tu pedido está en camino...');
    }, 5000);  // Notificación de "En camino" después de 5 segundos

    setTimeout(() => {
        showOrderStatusNotification('Tu pedido ha sido entregado.');
    }, 10000);  // Notificación de "Entregado" después de 10 segundos
}

// Show warning modal
function showWarningModal(message) {
    const warningModal = document.getElementById('cart-warning-modal');
    const warningMessage = document.getElementById('cart-warning-message');
    warningMessage.textContent = message;
    warningModal.style.display = 'block';

    document.querySelector('.close-warning').addEventListener('click', function() {
        warningModal.style.display = 'none';
    });

    document.getElementById('close-warning-button').addEventListener('click', function() {
        warningModal.style.display = 'none';
    });
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target == document.getElementById('order-summary-modal')) {
        document.getElementById('order-summary-modal').style.display = 'none';
    }
    if (event.target == document.getElementById('qr-payment-modal')) {
        document.getElementById('qr-payment-modal').style.display = 'none';
    }
    if (event.target == document.getElementById('order-status-modal')) {
        document.getElementById('order-status-modal').style.display = 'none';
    }
};
