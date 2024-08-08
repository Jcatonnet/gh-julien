import React, { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { Button, Typography } from '@mui/material'
import CartItem from './CartItem'
import Link from 'next/link'
import CartSummary from './CartSummary'
import EmptyCart from './EmptyCart'
import { getOrder, purchaseOrder } from '../../utils/api'

const Cart: React.FC = () => {
	const { cartItems, setCartItems, clearCart } = useCart()
	const [orderId, setOrderId] = useState<number | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [purchaseSuccess, setPurchaseSuccess] = useState(false)

	useEffect(() => {
		const fetchOrder = async () => {
			const storedOrderId = localStorage.getItem('orderId')
			if (storedOrderId) {
				setOrderId(Number(storedOrderId))
				try {
					const data = await getOrder(Number(storedOrderId))
					setCartItems(
						data.products.map((product: any) => ({
							id: product.product.id,
							name: product.product.name,
							description: product.product.description,
							image: product.product.image,
							price: product.product.price,
							quantity: product.quantity,
							category: product.product.category,
						})),
					)
				} catch (err) {
					setError('Failed to fetch order details')
				} finally {
					setLoading(false)
				}
			} else {
				setLoading(false)
			}
		}

		fetchOrder()
	}, [setCartItems])

	const groupedItems = cartItems.reduce((groups: any, item) => {
		const category = item.category.name
		if (!groups[category]) {
			groups[category] = []
		}
		groups[category].push(item)
		return groups
	}, {})

	const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

	const handlePurchase = async () => {
		if (orderId) {
			try {
				await purchaseOrder(orderId)
				setPurchaseSuccess(true)
				clearCart()
			} catch (err) {
				setError('Failed to complete purchase')
			}
		}
	}

	if (loading) return <div>Loading...</div>
	if (error) return <div>{error}</div>

	if (purchaseSuccess) {
		return (
			<div className="container mx-auto py-10 px-4">
				<Typography variant="h4" className="mb-8 text-center md:text-left">
					Payment Successful
				</Typography>
				<div className="w-full md:w-1/4 flex flex-col items-center md:items-center gap-4 mt-12">
					<CartSummary />
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-10 px-4">
			<Typography variant="h4" className="mb-8 text-center md:text-left">
				Your Shopping Cart
			</Typography>
			{cartItems.length === 0 ? (
				<EmptyCart />
			) : (
				<div className="flex flex-col md:flex-row mt-8">
					<div className="w-full md:w-3/4 mb-8 md:mb-0">
						{Object.keys(groupedItems).map((category) => (
							<div key={category}>
								<h6 className="mb-4 border-b-2 border-gray-300">{category}</h6>
								{groupedItems[category].map((item: any) => (
									<CartItem key={item.id} item={item} orderId={orderId} />
								))}
							</div>
						))}
					</div>
					<div className="w-full md:w-1/4 flex flex-col items-center md:items-center gap-4 mt-12">
						<CartSummary />
						<Button
							onClick={handlePurchase}
							variant="contained"
							color="primary"
							className="w-full md:w-auto"
						>
							Proceed to Payment
						</Button>
						<Link href="/">Continue Shopping</Link>
					</div>
				</div>
			)}
		</div>
	)
}

export default Cart
