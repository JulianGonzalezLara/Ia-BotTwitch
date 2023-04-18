import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config({path: '../.env'})

// const trim = (message) => message.trim().replace(/^"|"$/g, "")

export const queryGPT = async (message) => {
    const KEY_GPT = process.env.KEY_GPT
    const MAXCHARACTERS = 100
    const MODEL = 'gpt-3.5-turbo'
    const API_URL = 'https://api.openai.com/v1/chat/completions'

    const cleanMessage = message.replaceAll(`"`, "'")

    const prompt = `Imagina que eres un usuario del chat. Otro usuario ha dicho: "${cleanMessage}". El contexto del chat es temática de videojuegos, tienes que hablar como un narrador de futbol como manolo lama. Máximo ${MAXCHARACTERS} caracteres.`

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY_GPT}`
    }

    const body = {
        messages:[{
            "role": "user",
            "content": prompt
        }],
        model: MODEL,
        max_tokens: MAXCHARACTERS,
        n: 1,
        stop: null
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })

        const data = await response.json()

        const { total_tokens } = data.usage; 
        const { content } = data.choices[0].message;

        return {
            total_tokens,
            content
        }
    }catch (error) {
        return {
            total_tokens: 0,
            content: 'No se ha podido completar la petición.'
        }
    }

}