import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Message, Language } from '../types';

// Initialize Gemini Client
// Note: In a real app, ensure process.env.API_KEY is set.
// For this generated code, we assume the environment is set up correctly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  language: Language
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash'; // Using Flash for speed/latency

    // Construct history for the model
    // We only take the last few messages to save tokens, plus the system instruction
    const recentHistory = history.slice(-6).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add context about language
    const languageInstruction = `IMPORTANT: Please respond in ${language === Language.ENGLISH ? 'English' : language === Language.URDU ? 'Urdu' : 'Punjabi'}.`;

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\n" + languageInstruction,
      },
      history: recentHistory as any,
    });

    const result: GenerateContentResponse = await chat.sendMessage({
        message: newMessage
    });

    return result.text || "Sorry, I could not generate a response.";

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Maaf kijiye, kuch takneeki kharabi hai. (Sorry, technical error).";
  }
};

export const analyzeCropImage = async (
  base64Image: string,
  language: Language
): Promise<string> => {
  try {
     // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const prompt = `
      Analyze this crop image.
      1. Identify the crop.
      2. Detect any disease, pest, or deficiency. If healthy, say so.
      3. Provide a treatment plan (medicines, dosage).
      4. Suggest prevention methods.
      
      Format the output as a JSON object with keys: 
      "cropDetected", "disease", "severity", "treatment" (array of strings), "prevention" (array of strings), "confidence" (number 0-100).
      
      Translate the CONTENT of the values into ${language === Language.ENGLISH ? 'English' : language === Language.URDU ? 'Urdu' : 'Punjabi'}.
      Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Flash supports multimodal
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "{}";

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("Image analysis failed");
  }
};