import React from 'react'
import { useCart } from '../../context/CartContext'
import { Box, Typography } from '@mui/material'

const CartSummary: React.FC = () => {
	const { cartItems } = useCart()

	const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

	return (
		<div className="w-full p-4 border border-gray-300 rounded-lg">
			<Typography variant="h5" className="mb-4">
				Cart Summary
			</Typography>
			{cartItems.map((item) => (
				<div key={item.id} className="flex justify-between items-center mb-2">
					<Typography variant="body1">{item.name}</Typography>
					<Typography variant="body1">x {item.quantity}</Typography>
					<Typography variant="body1">${(item.price * item.quantity).toFixed(2)}</Typography>
				</div>
			))}
			<div className="flex justify-between items-center mt-4">
				<Typography variant="h6">Total:</Typography>
				<Typography variant="h6">${total.toFixed(2)}</Typography>
			</div>
		</div>
	)
}

export default CartSummary
