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
		console.log(process.env.OPENAI_API_KEY)
		if (req.method === "POST") {
			const { messages } = req.body

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
