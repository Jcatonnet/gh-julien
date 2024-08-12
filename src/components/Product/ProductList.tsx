import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import Link from 'next/link'
import { useCart } from '~/context/CartContext'
import { useProduct } from '~/context/ProductContext'
import ProductCard from '~/components/Product/ProductItem'
import { Product } from '~/types/types'
import { createOrder, getOrder } from '~/utils/api'
import { ClipLoader } from 'react-spinners'

const ProductList = () => {
	const { cartItems, setOrderId, orderId } = useCart()
	const { products, fetchProducts } = useProduct()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

	useEffect(() => {
		fetchProducts(setLoading, setError)
	}, [])

	const handleGoToCart = async () => {
		if (orderId === null && cartItems.length > 0) {
			try {
				const response = await createOrder(cartItems.map((item) => ({ id: item.id, quantity: item.quantity })))
				setOrderId(response.id)
				localStorage.setItem('orderId', response.id.toString())
			} catch (err) {
				setError('Failed to create order')
			}
		}
	}

	if (loading)
		return (
			<div className="flex flex-col justify-center items-center min-h-screen">
				<ClipLoader color="#9c27b0" size={50} />
				<p className="mt-4">We are collecting all the best products for you...</p>
			</div>
		)

	if (error)
		return (
			<div className="flex flex-col gap-4 min-h-screen mt-8 text-center text-red-500">
				<p>{error}</p>
				<Link href="/" className="w-full">
					<Button variant="outlined" color="secondary" className="w-60% mt-4">
						Show me all products
					</Button>
				</Link>
			</div>
		)

	const groupedProducts = products.reduce((acc, product) => {
		const category = product.category.name
		if (!acc[category]) acc[category] = []
		acc[category].push(product)
		return acc
	}, {} as { [key: string]: Product[] })

	const categories = Object.keys(groupedProducts)

	const filteredProducts = selectedCategory ? groupedProducts[selectedCategory] || [] : products

	return (
		<div className="px-4">
			<div className="flex justify-end mb-4">
				<Link href="/cart">
					<Button color="secondary" onClick={handleGoToCart} variant="contained">
						See my order
					</Button>
				</Link>
			</div>

			<div className="mb-4 flex flex-wrap justify-center gap-2">
				<Button
					onClick={() => setSelectedCategory(null)}
					color="secondary"
					variant={selectedCategory === null ? 'contained' : 'outlined'}
				>
					All
				</Button>
				{categories.map((category) => (
					<Button
						key={category}
						onClick={() => setSelectedCategory(category)}
						color="secondary"
						variant={selectedCategory === category ? 'contained' : 'outlined'}
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
