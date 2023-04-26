import Head from "next/head"
import { useState } from "react"
import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"

const inter = Inter({ subsets: ["latin"] })

interface Message {
	role: string
	content: string
}

export default function Home() {
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState<any>([
		{
			role: "system",
			content:
				"Ich bin ein Immobilienverwalter der allen Kunden bei Fragen zur Seite steht. Außerdem helfe ich bei der Suche nach einer passenden Immobilie.",
		},
	])
	const [status, setStatus] = useState("idle")

	const sendMessage = () => {
		if (message === "") return
		setStatus("loading")
		let array: Message[] = [...messages]
		array.push({ role: "user", content: message })
		setMessages(array)
		setMessage("")
		fetch("api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ messages: array }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) return console.log(data.error)
				array.push(data)
				setMessages(array)
				setStatus("idle")
			})
			.catch((err) => {
				console.log(err)
				setStatus("error")
			})
	}

	return (
		<>
			<Head>
				<title>Chatbot</title>
				<meta name="description" content="Chatbot." />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="">
				<div className="bg-gray-700 w-full h-screen text-white font-medium">
					<div className="flex flex-col w-full h-full">
						<div className="flex flex-row w-full h-[80%] overflow-x-hidden overflow-scroll gap-2">
							<div className="w-full flex h-full flex-col gap-4 p-2">
								{messages.length > 0 &&
									messages.map((message: any, index: number) => {
										return message.role === "user" ? (
											<div className="w-full flex justify-start" key={index}>
												<div className="p-2 rounded-xl border-2 min-w-[80px] max-w-[400px]">
													{message.content}
												</div>
											</div>
										) : (
											message.role === "assistant" && (
												<div className="w-full flex justify-end" key={index}>
													<div className="p-2 rounded-xl border-2 max-w-[400px]">
														{message.content}
													</div>
												</div>
											)
										)
									})}
							</div>
						</div>
						<div className="flex w-full fixed bottom-3 justify-center">
							<div className="flex flex-row gap-2 items-center">
								<textarea
									value={message}
									className="text-black w-80 h-20 p-2"
									onChange={(e) => setMessage(e.target.value)}></textarea>
								<button
									className="bg-blue-500 w-24 justify-center flex items-center h-full p-1 px-2 rounded-md"
									onClick={() => {
										sendMessage()
									}}>
									{status === "loading" ? (
										<div className="flex flex-row gap-2 items-center">
											<div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
											<div className="w-3 h-3 rounded-full bg-white animate-bounce200"></div>
											<div className="w-3 h-3 rounded-full bg-white animate-bounce400"></div>
										</div>
									) : (
										<div className="flex flex-row gap-2 items-center">
											Send{" "}
										</div>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	)
}
