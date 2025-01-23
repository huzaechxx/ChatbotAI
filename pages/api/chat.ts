import { connectToDatabase } from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Chat from '../../models/chat';
const { GoogleGenerativeAI } = require("@google/generative-ai");
const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    await connectToDatabase();
    
    try {
      // Generate content based on the prompt
      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();
      const chats = new Chat({question:prompt,answer:generatedText});
      await chats.save();
      return res.status(200).json({ generatedText });
      
    } catch (error:any) {
      console.error("Error generating content:", error);
      return res.status(500).json({ message: "Error generating content", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
