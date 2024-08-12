import axios from 'axios'

export const getProducts = async () => {
	const response = await axios.get('/api/products')

	return response.data
}

export const createOrder = async (products: { id: number; quantity: number }[]) => {
	const response = await axios.post('/api/orders', { products })
	return response.data
}

export const getOrder = async (orderId: number) => {
	const response = await axios.get(`/api/orders/${orderId}`)
	return response.data
}

export const patchOrder = async (orderId: number, productId: number, quantity: number) => {
	const response = await axios.patch(`/api/orders/${orderId}`, {
		action: 'update_quantity',
		productId,
		quantity,
	})
	return response.data
}

export const purchaseOrder = async (orderId: number) => {
	await axios.post(`/api/orders/${orderId}/buy`)
}
