import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { fetchAndSetProducts } from '~/services/productService'
import { Product } from '~/types/types'

interface ProductContextType {
	products: Product[]
	setProducts: React.Dispatch<React.SetStateAction<Product[]>>
	fetchProducts: (
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
		setError: React.Dispatch<React.SetStateAction<string | null>>,
	) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [products, setProducts] = useState<Product[]>([])

	const fetchProducts = useCallback(
		(
			setLoading: React.Dispatch<React.SetStateAction<boolean>>,
			setError: React.Dispatch<React.SetStateAction<string | null>>,
		) => {
			fetchAndSetProducts(setProducts, setLoading, setError)
		},
		[],
	)

	return (
		<ProductContext.Provider
			value={{
				products,
				setProducts,
				fetchProducts,
			}}
		>
			{children}
		</ProductContext.Provider>
	)
}

export const useProduct = (): ProductContextType => {
	const context = useContext(ProductContext)
	if (context === undefined) {
		throw new Error('useProduct must be used within a ProductProvider')
	}
	return context
}
