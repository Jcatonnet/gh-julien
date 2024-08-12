import { Inter } from 'next/font/google'
import ProductList from '~/components/Product/ProductList'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-between px-4 sm:px-8 md:p-24 lg:px-24 ${inter.className}`}
		>
			<div>
				<h1 className="text-center text-3xl sm:text-4xl font-bold">Welcome to Alibaba Cavern Store</h1>
				<ProductList />
			</div>
		</main>
	)
}
