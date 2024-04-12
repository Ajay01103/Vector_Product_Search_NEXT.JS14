import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: String(process.env.OPENAI_KEY!),
})
