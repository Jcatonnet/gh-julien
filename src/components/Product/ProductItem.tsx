import { Button, Snackbar, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { Product } from '~/types/types'

const ProductCard = ({ product }: { product: Product }) => {
	const { addToCart } = useCart()
	const [quantity, setQuantity] = useState<number>(1)
	const [openToast, setOpenToast] = useState<boolean>(false)

	const handleAddToCart = () => {
		addToCart(product, quantity)
		setOpenToast(true)
	}

	return (
		<div className="w-full relative group">
			<Snackbar
				open={openToast}
				onClose={() => setOpenToast(false)}
				autoHideDuration={2000}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				message="Product added to cart"
			/>
			<div className="relative overflow-hidden rounded-t-2xl">
				<img className="w-full h-full object-cover" src={product.image} alt={product.name} />
			</div>
			<div className="py-6 flex flex-col gap-2 bg-white border-[1px] border-t-0 px-4 rounded-b-2xl">
				<div className="flex items-center justify-between font-titleFont">
					<h2 className="text-lg text-primeColor font-bold">{product.name}</h2>
					<p className="text-[#767676] text-[14px] font-bold">${product.price}</p>
				</div>
				<div className="h-24 overflow-y-auto mb-4">
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
					<Button onClick={handleAddToCart} variant="text" color="secondary">
						Add to cart
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ProductCard
