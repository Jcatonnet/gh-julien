import React, { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { IconButton, TextField, Typography, Button } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { patchOrder } from '../../utils/api'
import { CartItemProps } from '~/types/types'

const CartItem = ({ item, orderId }: CartItemProps) => {
	const { updateQuantity, removeItem } = useCart()
	const [quantity, setQuantity] = useState(item.quantity)

	const handleDecrement = async () => {
		const updatedQty = quantity > 1 ? quantity - 1 : 1
		setQuantity(updatedQty)
		updateQuantity(item.id, updatedQty)
		if (orderId) await updateOrderQuantity(item.id, updatedQty)
	}

	const handleIncrement = async () => {
		const updatedQty = quantity + 1
		setQuantity(updatedQty)
		updateQuantity(item.id, updatedQty)
		if (orderId) await updateOrderQuantity(item.id, updatedQty)
	}

	const handleQuantityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedQty = Number(e.target.value)
		setQuantity(updatedQty)
		updateQuantity(item.id, updatedQty)
		if (orderId) await updateOrderQuantity(item.id, updatedQty)
	}

	const updateOrderQuantity = async (productId: number, quantity: number) => {
		try {
			await patchOrder(orderId as number, productId, quantity)
		} catch (err) {
			console.error('Failed to update order quantity', err)
		}
	}

	return (
		<div className="flex flex-col lg:flex-row items-center gap-4 mb-4 p-4 border border-gray-300 shadow-md w-full lg:w-3/5 mx-auto">
			<img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
			<div className="flex-grow text-center md:text-left">
				<Typography variant="h6">{item.name}</Typography>
				<Typography variant="body1">${item.price.toFixed(2)} per unit</Typography>
				<div className="flex items-center justify-center md:justify-start mt-2">
					<IconButton onClick={handleDecrement} color="primary">
						<RemoveIcon className="text-primary" />
					</IconButton>
					<TextField
						type="number"
						value={quantity}
						size="small"
						onChange={handleQuantityChange}
						inputProps={{ min: 1 }}
						className="w-16 mx-2"
					/>
					<IconButton onClick={handleIncrement} color="primary">
						<AddIcon className="text-primary" />
					</IconButton>
				</div>
			</div>
			<Button color="error" onClick={() => removeItem(item.id)} className="mt-2" startIcon={<DeleteIcon />}>
				Remove
			</Button>
		</div>
	)
}

export default CartItem
