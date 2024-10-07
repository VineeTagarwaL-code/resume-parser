import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
async function sendToGemini(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const newPrompt = `
     Plese verify if the following text is a resume. If it is, 
  
     1. Provide the resumein Json Format 
     2. Give links instead of text that are hyperlinks
     3. Give the description of everything in the form of array
     6. Make sure that its a proper json format that can be parsed successfully
      If it is not a valid resume,  Respond with "This is not a valid resume": ${text}
    `;

  const result = await model.generateContent(newPrompt);
  const geminiResponse = result.response.text();
  return geminiResponse;
}

export { sendToGemini };
