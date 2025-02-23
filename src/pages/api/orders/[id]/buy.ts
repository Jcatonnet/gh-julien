import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const EXTERNAL_API_URL = 'https://gh-fe-exercise-api-4f80a724b506.herokuapp.com/api/orders'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.query

	if (req.method === 'POST') {
		try {
			await axios.post(`${EXTERNAL_API_URL}/${id}/buy`)
			res.status(200).json({ message: 'Order purchased successfully' })
		} catch (error) {
			res.status(500).json({ message: 'Failed to complete purchase' })
		}
	} else {
		res.setHeader('Allow', ['POST'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
