import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { sendToGemini } from "../gemini";
const fileSourcePath = __dirname + "/uploads";
// how to get the root path
const rootPath = path.resolve(__dirname, "../../");
console.log(rootPath);
const getResumeJson = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const filePath = path.join(rootPath, "uploads", req.file.filename);
  console.log(filePath);
  const fileExt = path.extname(req.file.originalname).toLowerCase();
  const uploadDir = path.join(rootPath, "uploads");
  console.log(uploadDir);
  try {
    let extractedText = "";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    if (fileExt === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (fileExt === ".docx") {
      const docxData = await mammoth.extractRawText({ path: filePath });
      extractedText = docxData.value;
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    const geminiResponse = await sendToGemini(extractedText);

    fs.unlinkSync(filePath);

    const response = geminiResponse.replace("```json", "").replace("```", "");
    res.status(200).json(JSON.parse(response));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to process file or connect to Google Gemini API",
    });
  }
};

export { getResumeJson };
