import { Button, Typography } from '@mui/material'
import CartSummary from './CartSummary'
import Link from 'next/link'
import { useCart } from '~/context/CartContext'

const PaymentSuccess = () => {
	const { clearCart } = useCart()

	const handleClick = () => {
		clearCart()
		localStorage.removeItem('orderId')
	}
	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<Typography variant="h4" className="mb-8 text-center md:text-left">
				Payment Successful
			</Typography>
			<div className="w-full flex flex-col items-center md:items-center mt-12">
				<CartSummary />
			</div>
			<Link href="/">
				<Button color="secondary" onClick={handleClick}>
					Continue Shopping
				</Button>
			</Link>
		</div>
	)
}

export default PaymentSuccess
