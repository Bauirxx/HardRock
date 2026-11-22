import React from 'react';

// Cart key is scoped per authenticated user so admin actions never bleed into client cart
function _cartKey() {
    try {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // Extract user id from JWT payload (middle segment)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const uid = payload.user_id || payload.sub || payload.id;
            if (uid) return `gym_cart_${uid}`;
        }
    } catch { /* ignore */ }
    return 'gym_cart_guest';
}

function getCart() {
    try { return JSON.parse(localStorage.getItem(_cartKey())) || []; }
    catch { return []; }
}

function saveCart(items) {
    localStorage.setItem(_cartKey(), JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
}

export function addToCart(product, quantity = 1, options = {}) {
    const items = getCart();
    const key = options.color ? `${product.id}_${options.color}` : product.id;
    const existing = items.find(i => i.cart_key === key);
    if (existing) {
        existing.quantidade += quantity;
    } else {
        items.push({
            cart_key: key,
            product_id: product.id,
            nome: product.nome,
            preco: product.preco_promocional || product.preco,
            quantidade: quantity,
            imagem: product.imagens?.[0] || '',
            cor: options.color || null,
        });
    }
    saveCart(items);
}

export function removeFromCart(cartKey) {
    saveCart(getCart().filter(i => i.cart_key !== cartKey && i.product_id !== cartKey));
}

export function updateCartQuantity(cartKey, quantity) {
    const items = getCart();
    const item = items.find(i => i.cart_key === cartKey || i.product_id === cartKey);
    if (!item) return;
    if (quantity <= 0) { removeFromCart(cartKey); return; }
    item.quantidade = quantity;
    saveCart(items);
}

export function getCartItems() { return getCart(); }
export function getCartTotal() { return getCart().reduce((s, i) => s + i.preco * i.quantidade, 0); }
export function getCartCount() { return getCart().reduce((s, i) => s + i.quantidade, 0); }
export function clearCart() { localStorage.removeItem(_cartKey()); window.dispatchEvent(new Event('cart-updated')); }

export function useCart() {
    const [items, setItems] = React.useState(getCartItems());

    React.useEffect(() => {
        const handler = () => setItems(getCartItems());
        window.addEventListener('cart-updated', handler);
        window.addEventListener('storage', handler);
        return () => { window.removeEventListener('cart-updated', handler); window.removeEventListener('storage', handler); };
    }, []);

    return {
        items,
        total: items.reduce((s, i) => s + i.preco * i.quantidade, 0),
        count: items.reduce((s, i) => s + i.quantidade, 0),
        addItem: addToCart,
        removeItem: removeFromCart,
        updateQuantity: updateCartQuantity,
        clear: clearCart,
    };
}
