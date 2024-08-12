import { CartItem } from '~/types/types'
import { getOrder, purchaseOrder } from '~/utils/api'

export const fetchAndSetOrder = async (
	orderId: number,
	setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
	try {
		const data = await getOrder(orderId)
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
}

export const handlePurchaseProcess = async (
	orderId: number | null,
	setPurchaseSuccess: React.Dispatch<React.SetStateAction<boolean>>,
	// clearCart: () => void,
	setError: React.Dispatch<React.SetStateAction<string | null>>,
) => {
	if (orderId) {
		try {
			await purchaseOrder(orderId)
			setPurchaseSuccess(true)
			// clearCart()
			localStorage.removeItem('orderId')
		} catch (err) {
			setError('Failed to complete purchase, please try again')
		}
	} else {
		setError('Order ID is not defined. Please try again.')
	}
}

export const groupItemsByCategory = (cartItems: CartItem[]) => {
	return cartItems.reduce((groups: any, item) => {
		const category = item.category.name
		if (!groups[category]) {
			groups[category] = []
		}
		groups[category].push(item)
		return groups
	}, {})
}
