import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { CartProvider } from '~/context/CartContext'
import { ProductProvider } from '~/context/ProductContext'
import ProductList from '~/components/Product/ProductList'
import { createOrder, getOrder, patchOrder } from '~/utils/api'

jest.mock('~/utils/api', () => ({
	createOrder: jest.fn(),
	getOrder: jest.fn(),
	patchOrder: jest.fn(),
}))

describe('ProductList Page', () => {
	it('should create an order and add a product to the cart', async () => {
		const mockedCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>
		mockedCreateOrder.mockResolvedValueOnce({ id: 1 })

		const { getByText } = render(
			<CartProvider>
				<ProductProvider>
					<ProductList />
				</ProductProvider>
			</CartProvider>,
		)

		fireEvent.click(getByText('Add to cart'))

		await waitFor(() => {
			expect(mockedCreateOrder).toHaveBeenCalledWith([{ id: 1, quantity: 1 }])
		})

		expect(getByText('See my order')).toBeInTheDocument()
	})

	it('should fetch the existing order when "See my order" is clicked', async () => {
		const mockedGetOrder = getOrder as jest.MockedFunction<typeof getOrder>
		mockedGetOrder.mockResolvedValueOnce({
			id: 1,
			products: [{ id: 1, quantity: 1, product: { id: 1, name: 'Test Product', price: 100 } }],
		})

		const { getByText } = render(
			<CartProvider>
				<ProductProvider>
					<ProductList />
				</ProductProvider>
			</CartProvider>,
		)

		fireEvent.click(getByText('See my order'))

		await waitFor(() => {
			expect(mockedGetOrder).toHaveBeenCalledWith(1)
		})
	})

	it('should create a new order if all products in the stored order have a quantity of 0', async () => {
		const mockedCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>
		const mockedGetOrder = getOrder as jest.MockedFunction<typeof getOrder>

		mockedGetOrder.mockResolvedValueOnce({
			id: 1,
			products: [{ id: 1, quantity: 0, product: { id: 1, name: 'Test Product', price: 100 } }],
		})

		mockedCreateOrder.mockResolvedValueOnce({ id: 2 })

		const { getByText } = render(
			<CartProvider>
				<ProductProvider>
					<ProductList />
				</ProductProvider>
			</CartProvider>,
		)

		fireEvent.click(getByText('See my order'))

		await waitFor(() => {
			expect(mockedGetOrder).toHaveBeenCalledWith(1)
		})

		await waitFor(() => {
			expect(mockedCreateOrder).toHaveBeenCalled()
		})

		expect(getByText('See my order')).toBeInTheDocument()
	})

	it('should update an order when adding a product to a non-empty cart', async () => {
		const mockedCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>
		const mockedPatchOrder = patchOrder as jest.MockedFunction<typeof patchOrder>

		mockedCreateOrder.mockResolvedValueOnce({ id: 1 })

		const { getByText } = render(
			<CartProvider>
				<ProductProvider>
					<ProductList />
				</ProductProvider>
			</CartProvider>,
		)

		fireEvent.click(getByText('Add to cart')) // First add to cart, creates order

		await waitFor(() => {
			expect(mockedCreateOrder).toHaveBeenCalled()
		})

		fireEvent.click(getByText('Add to cart')) // Second add to cart, updates order

		await waitFor(() => {
			expect(mockedPatchOrder).toHaveBeenCalledWith(1, 1, 2)
		})
	})

	it('should handle API errors gracefully when creating an order', async () => {
		const mockedCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>
		mockedCreateOrder.mockRejectedValueOnce(new Error('Order creation failed'))

		const { getByText } = render(
			<CartProvider>
				<ProductProvider>
					<ProductList />
				</ProductProvider>
			</CartProvider>,
		)

		fireEvent.click(getByText('Add to cart'))

		await waitFor(() => {
			expect(mockedCreateOrder).toHaveBeenCalled()
		})

		expect(getByText('Failed to create order')).toBeInTheDocument()
	})

	it('should handle API errors gracefully when fetching an order', async () => {
		const mockedGetOrder = getOrder as jest.MockedFunction<typeof getOrder>
		mockedGetOrder.mockRejectedValueOnce(new Error('Failed to fetch order'))

		const { getByText } = render(
			<CartProvider>
				<ProductProvider>
					<ProductList />
				</ProductProvider>
			</CartProvider>,
		)

		fireEvent.click(getByText('See my order'))

		await waitFor(() => {
			expect(mockedGetOrder).toHaveBeenCalled()
		})

		expect(getByText('Failed to fetch order')).toBeInTheDocument()
	})
})
