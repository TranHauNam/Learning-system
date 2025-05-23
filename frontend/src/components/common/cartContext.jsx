import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Hàm tăng số lượng
  const incrementCart = useCallback(() => setCartCount(c => c + 1), []);
  // Hàm giảm số lượng
  const decrementCart = useCallback(() => setCartCount(c => Math.max(0, c - 1)), []);
  // Hàm set trực tiếp
  const setCart = useCallback((count) => setCartCount(count), []);
  // Hàm load số lượng từ backend/localStorage (có thể mở rộng sau)
  const loadCartCount = useCallback((count) => setCartCount(count), []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount: setCart, incrementCart, decrementCart, loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
}; 