import type { NextApiRequest, NextApiResponse } from "next"
import { Configuration, OpenAIApi } from "openai"

type Handler = (
	req: NextApiRequest,
	res: NextApiResponse
) => void | Promise<void>

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const handler: Handler = async (req, res) => {
	try {
		if (req.method === "POST") {
			const apiKey = process.env.OPENAI_API_KEY

			const { messages } = req.body

			if (!apiKey) {
				res.status(401).json({ message: "No apiKey provided." })
				return
			}

			if (!messages) {
				res.status(400).json({ message: "No messages provided." })
				return
			}

			const chatGpt = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages,
			})

			const chatGptMessage = chatGpt.data.choices[0].message

			res.status(200).json(chatGptMessage)
			return
		} else {
			res.status(405).json({ message: "Method not allowed" })
			return
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: "Internal server error", error: error })
		return
	}
}

export default handler
