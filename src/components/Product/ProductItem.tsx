import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useCart } from '../../context/CartContext'

interface Product {
	product: {
		id: number
		name: string
		description: string
		image: string
		price: number
		category: {
			name: string
		}
	}
}

const ProductCard = ({ product }: Product) => {
	const { addToCart } = useCart()
	const [quantity, setQuantity] = useState(1)
	const handleAddToCart = () => {
		addToCart(product, quantity)
	}

	return (
		<div className="w-full relative group">
			<div className="max-w-80 max-h-80 relative overflow-hidden rounded-t-2xl">
				<div>
					<img className="w-full h-full object-cover" src={product.image} alt={product.name} />
				</div>
			</div>
			<div className="max-w-80 py-6 flex bg-white flex-col gap-1 border-[1px] border-t-0 px-4 rounded-b-2xl">
				<div className="flex items-center justify-between font-titleFont">
					<h2 className="text-lg text-primeColor font-bold">{product.name}</h2>
					<p className="text-[#767676] text-[14px] font-bold">${product.price}</p>
				</div>
				<div className="h-24 overflow-y-scroll mb-4">
					<p className="text-[#767676] text-[14px]">{product.description}</p>
				</div>
				<div className="flex items-center justify-between">
					<TextField
						className="w-1/3"
						type="number"
						label="Quantity"
						value={quantity}
						onChange={(e) => setQuantity(Number(e.target.value))}
						inputProps={{ min: 1 }}
						variant="outlined"
						size="small"
					/>
					<Button onClick={handleAddToCart} variant="text" color="primary">
						Add to cart
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ProductCard
