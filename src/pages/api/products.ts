import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const EXTERNAL_API_URL = 'https://gh-fe-exercise-api-4f80a724b506.herokuapp.com/api/products?norandom'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const response = await axios.get(EXTERNAL_API_URL)
		res.status(200).json(response.data)
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch products' })
	}
}
