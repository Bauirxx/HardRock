// Simple cart store using localStorage
const CART_KEY = 'gym_cart';

function getCart() {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
}

function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
}

export function addToCart(product, quantity = 1) {
    const items = getCart();
    const existing = items.find(i => i.product_id === product.id);
    if (existing) {
        existing.quantidade += quantity;
    } else {
        items.push({
            product_id: product.id,
            nome: product.nome,
            preco: product.preco_promocional || product.preco,
            quantidade: quantity,
            imagem: product.imagens?.[0] || '',
        });
    }
    saveCart(items);
}

export function removeFromCart(productId) {
    const items = getCart().filter(i => i.product_id !== productId);
    saveCart(items);
}

export function updateCartQuantity(productId, quantity) {
    const items = getCart();
    const item = items.find(i => i.product_id === productId);
    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantidade = quantity;
        saveCart(items);
    }
}

export function getCartItems() {
    return getCart();
}

export function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.preco * item.quantidade, 0);
}

export function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantidade, 0);
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('cart-updated'));
}

export function useCart() {
    const [items, setItems] = React.useState(getCartItems());

    React.useEffect(() => {
        const handler = () => setItems(getCartItems());
        window.addEventListener('cart-updated', handler);
        return () => window.removeEventListener('cart-updated', handler);
    }, []);

    return {
        items,
        total: items.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
        count: items.reduce((sum, item) => sum + item.quantidade, 0),
        addItem: addToCart,
        removeItem: removeFromCart,
        updateQuantity: updateCartQuantity,
        clear: clearCart,
    };
}

import React from 'react';