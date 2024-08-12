import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import { CartProvider } from '~/context/CartContext'
import { ProductProvider } from '~/context/ProductContext'

// if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
// 	require('../mocks')
// }

export default function App({ Component, pageProps }: AppProps) {
	return (
		<CartProvider>
			<ProductProvider>
				<Component {...pageProps} />
			</ProductProvider>
		</CartProvider>
	)
}
