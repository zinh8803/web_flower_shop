import React, { createContext, useState, useEffect } from "react";

// Tạo CartContext
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Hàm tính tổng số lượng sản phẩm trong giỏ
    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Hàm để thêm sản phẩm vào giỏ
    const addToCart = (product) => {
        const existingProduct = cart.find(item => item.productId === product.productId);
        if (existingProduct) {
            const updatedCart = cart.map(item =>
                item.productId === product.productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    // Lưu giỏ hàng vào localStorage mỗi khi giỏ hàng thay đổi
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, getCartCount, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};
