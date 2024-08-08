import React, { useState, useEffect } from 'react'
import { createOrder, getProducts, patchOrder } from '../../utils/api'
import ProductCard from './ProductItem'
import Link from 'next/link'
import { Button } from '@mui/material'
import { useCart } from '../../context/CartContext'

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

const ProductList: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [orderId, setOrderId] = useState<number | null>(null)
	const { cartItems } = useCart()

	useEffect(() => {
		const loadProducts = async () => {
			try {
				const data = await getProducts()
				setProducts(data)
			} catch (err) {
				setError('Failed to load products')
			} finally {
				setLoading(false)
			}
		}

		loadProducts()
	}, [])

	const handleGoToCart = async () => {
		if (orderId === null) {
			try {
				const response = await createOrder(cartItems.map((item) => ({ id: item.id, quantity: item.quantity })))
				setOrderId(response.id)
				localStorage.setItem('orderId', response.id.toString())
			} catch (err) {
				setError('Failed to create order')
				return
			}
		}
	}

	if (loading) return <div>Loading...</div>
	if (error) return <div>{error}</div>

	const groupedProducts = products.reduce((acc, product) => {
		const category = product.category.name
		if (!acc[category]) acc[category] = []
		acc[category].push(product)
		return acc
	}, {} as { [key: string]: Product[] })

	return (
		<div>
			<Link href="/cart">
				<Button onClick={handleGoToCart}>See my order</Button>
			</Link>
			{Object.keys(groupedProducts).map((category) => (
				<div key={category}>
					<h2 className="font-bold mb-4">{category}</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{groupedProducts[category].map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			))}
		</div>
	)
}

export default ProductList
