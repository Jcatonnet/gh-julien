import React, { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { Button, Typography } from '@mui/material'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import EmptyCart from './EmptyCart'
import PaymentSuccess from './PaymentSuccess'
import { groupItemsByCategory, handlePurchaseProcess } from '~/services/cartService'
import { ClipLoader } from 'react-spinners'
import { CartItem as CartItemType } from '~/types/types'

const Cart = () => {
	const { cartItems, setCartItems, clearCart, orderId, setOrderId, fetchOrder } = useCart()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [purchaseSuccess, setPurchaseSuccess] = useState(false)

	useEffect(() => {
		const storedOrderId = localStorage.getItem('orderId')
		if (storedOrderId) {
			setOrderId(Number(storedOrderId))
			fetchOrder(Number(storedOrderId), setLoading, setError)
		} else {
			setLoading(false)
		}
	}, [setCartItems, setOrderId])

	const groupedItems = groupItemsByCategory(cartItems)

	const hasItemsWithQuantity = cartItems.some((item) => item.quantity > 0)

	const renderGroupedItems = Object.keys(groupedItems).map((category) => (
		<div key={category} className="mb-4">
			<h6 className="mb-4 border-b-2 font-bold border-gray-300">{category}</h6>
			<div className="flex flex-col gap-4">
				{groupedItems[category]
					.filter((item: CartItemType) => item.quantity > 0)
					.map((item: CartItemType) => (
						<CartItem key={item.id} item={item} orderId={orderId} />
					))}
			</div>
		</div>
	))

	const handlePurchase = () => {
		handlePurchaseProcess(orderId, setPurchaseSuccess, setError)
	}

	if (loading)
		return (
			<div className="flex flex-col justify-center items-center min-h-screen">
				<ClipLoader color="#9c27b0" size={50} />
				<p className="mt-4">We are preparing your order, please wait a second...</p>
			</div>
		)
	if (error)
		return (
			<div className="flex flex-col mt-8 text-center justify-center gap-4 text-red-500 min-h-screen">
				<p>{error}</p>
				<Button
					onClick={() => window.location.reload()}
					variant="outlined"
					color="secondary"
					className="w-60% mt-4"
				>
					Take me back to my cart
				</Button>
			</div>
		)

	if (purchaseSuccess) {
		return <PaymentSuccess />
	}

	return (
		<div className="container mx-auto py-10 px-4">
			<Typography variant="h4" className="mb-8 text-center md:text-left">
				Your Shopping Cart
			</Typography>
			{!hasItemsWithQuantity ? (
				<EmptyCart />
			) : (
				<div className="flex flex-col lg:flex-row mt-8">
					<div className="w-full md:w-3/4 mb-8 md:mb-0">{renderGroupedItems}</div>
					<div className="w-full lg:w-1/4 md:w-3/4 flex flex-col items-center gap-4 mt-12">
						<CartSummary />
						<Button
							onClick={handlePurchase}
							variant="contained"
							color="secondary"
							className="w-full"
							disabled={cartItems.length === 0}
						>
							Proceed to Payment
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

export default Cart
