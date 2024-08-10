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
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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

	if (loading) return <div>We are collecting all the best products for you...</div>
	if (error) return <div>{error}</div>

	const groupedProducts = products.reduce((acc, product) => {
		const category = product.category.name
		if (!acc[category]) acc[category] = []
		acc[category].push(product)
		return acc
	}, {} as { [key: string]: Product[] })

	const categories = Object.keys(groupedProducts)

	const filteredProducts = selectedCategory ? groupedProducts[selectedCategory] || [] : products

	return (
		<div>
			<div className="flex justify-end mb-4">
				<Link href="/cart">
					<Button color="secondary" onClick={handleGoToCart} variant="contained">
						See my order
					</Button>
				</Link>
			</div>

			<div className="mb-4 flex justify-center">
				<Button
					onClick={() => setSelectedCategory(null)}
					color="secondary"
					variant={selectedCategory === null ? 'contained' : 'outlined'}
					className="mr-2"
				>
					All
				</Button>
				{categories.map((category) => (
					<Button
						key={category}
						onClick={() => setSelectedCategory(category)}
						color="secondary"
						variant={selectedCategory === category ? 'contained' : 'outlined'}
						className="mr-2"
					>
						{category}
					</Button>
				))}
			</div>

			{selectedCategory === null ? (
				categories.map((category) => (
					<div key={category}>
						<h2 className="border-b-2 font-bold border-gray-300 mb-4">{category}</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{groupedProducts[category].map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</div>
				))
			) : (
				<div>
					<h2 className="font-bold mb-4">{selectedCategory}</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{filteredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default ProductList
