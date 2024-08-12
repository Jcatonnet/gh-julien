import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const EXTERNAL_API_URL = 'https://gh-fe-exercise-api-4f80a724b506.herokuapp.com/api/orders?norandom'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		try {
			const response = await axios.post(EXTERNAL_API_URL, req.body)
			res.status(201).json(response.data)
		} catch (error) {
			res.status(500).json({ message: 'Failed to create order' })
		}
	} else {
		res.setHeader('Allow', ['POST'])
		res.status(405).end(`Method ${req.method} Not Allowed`)
	}
}
