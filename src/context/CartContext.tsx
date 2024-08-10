import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Product {
	id: number
	name: string
	description: string
	image: string
	price: number
	category: {
		name: string
	}
}

interface CartItem extends Product {
	quantity: number
}

interface CartContextType {
	cartItems: CartItem[]
	setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
	addToCart: (product: Product, quantity: number) => void
	updateQuantity: (productId: number, quantity: number) => void
	removeItem: (productId: number) => void
	clearCart: () => void
	orderId: number | null
	setOrderId: React.Dispatch<React.SetStateAction<number | null>>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [orderId, setOrderId] = useState<number | null>(null)

	const addToCart = (product: Product, quantity: number) => {
		setCartItems((prevItems) => {
			const existingItem = prevItems.find((item) => item.id === product.id)
			if (existingItem) {
				return prevItems.map((item) =>
					item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
				)
			}
			return [...prevItems, { ...product, quantity }]
		})
	}

	const updateQuantity = (productId: number, quantity: number) => {
		setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
	}

	const removeItem = (productId: number) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
	}

	const clearCart = () => {
		setCartItems([])
	}

	return (
		<CartContext.Provider
			value={{ cartItems, setCartItems, addToCart, updateQuantity, removeItem, clearCart, orderId, setOrderId }}
		>
			{children}
		</CartContext.Provider>
	)
}

export const useCart = (): CartContextType => {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
}
