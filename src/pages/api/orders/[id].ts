import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const EXTERNAL_API_URL = 'https://gh-fe-exercise-api-4f80a724b506.herokuapp.com/api/orders'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.query

	if (req.method === 'GET') {
		try {
			const response = await axios.get(`${EXTERNAL_API_URL}/${id}`)
			res.status(200).json(response.data)
		} catch (error) {
			res.status(500).json({ message: 'Failed to fetch order' })
		}
	} else if (req.method === 'PATCH') {
		try {
			const response = await axios.patch(`${EXTERNAL_API_URL}/${id}`, req.body)
			res.status(200).json(response.data)
		} catch (error) {
			res.status(500).json({ message: 'Failed to update order' })
		}
	} else {
		res.setHeader('Allow', ['GET', 'PATCH'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
