import React, { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { Button, Typography } from '@mui/material'
import CartItem from './CartItem'
import Link from 'next/link'
import CartSummary from './CartSummary'
import EmptyCart from './EmptyCart'
import { getOrder, purchaseOrder } from '../../utils/api'
import PaymentSuccess from './PaymentSuccess'

const Cart: React.FC = () => {
	const { cartItems, setCartItems, clearCart, orderId, setOrderId } = useCart()
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
	}, [setCartItems, setOrderId])

	const groupedItems = cartItems.reduce((groups: any, item) => {
		const category = item.category.name
		if (!groups[category]) {
			groups[category] = []
		}
		groups[category].push(item)
		return groups
	}, {})

	const handlePurchase = async () => {
		if (orderId) {
			try {
				await purchaseOrder(orderId)
				setPurchaseSuccess(true)
				// clearCart()
				localStorage.removeItem('orderId')
			} catch (err) {
				setError('Failed to complete purchase')
			}
		} else {
			setError('Order ID is not defined. Please try again.')
		}
	}

	if (loading) return <div>We are preparing your order, please wait a second...</div>
	if (error) return <div>{error}</div>

	if (purchaseSuccess) {
		return <PaymentSuccess />
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
								<h6 className="mb-4 border-b-2 font-bold border-gray-300">{category}</h6>
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
							disabled={cartItems.length === 0}
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
