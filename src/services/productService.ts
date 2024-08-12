import { Product } from '~/types/types'
import { getProducts as fetchProducts } from '~/utils/api'

export const fetchAndSetProducts = async (
	setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
	setLoading(true)
	setError(null)
	try {
		const data = await fetchProducts()
		setProducts(data)
	} catch (err) {
		setError('Failed to load products')
	} finally {
		setLoading(false)
	}
}
