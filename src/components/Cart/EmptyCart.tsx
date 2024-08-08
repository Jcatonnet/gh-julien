import { Button, Typography } from '@mui/material'
import Link from 'next/link'

const EmptyCart = () => {
	return (
		<div className="text-center py-10 ">
			<Typography variant="h6" className="mb-4">
				Your cart is empty at the moment. Browse our shop to find amazing products !
			</Typography>
			<Link href="/">
				<Button className=" w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4">
					Go Shopping
				</Button>
			</Link>
		</div>
	)
}

export default EmptyCart
