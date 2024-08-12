export interface Product {
	id: number
	name: string
	description: string
	image: string
	price: number
	category: {
		name: string
	}
}

export interface CartItem extends Product {
	quantity: number
}

export interface CartItemProps {
	item: {
		id: number
		name: string
		price: number
		quantity: number
		image: string
		category: {
			name: string
		}
	}
	orderId: number | null
}
