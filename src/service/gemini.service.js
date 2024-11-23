import { GoogleGenerativeAI, } from "@google/generative-ai";

const GeminiService = (function () {

    const MODEL_NAME = "gemini-pro";
    const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const service = {};

    service.sendMessages = async function (message, prevChat) {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const chat = model.startChat({
            history: prevChat,
        });
        const result = await chat.sendMessageStream(message);
        return result.stream
    }

    return service;
}());

export default GeminiService;
