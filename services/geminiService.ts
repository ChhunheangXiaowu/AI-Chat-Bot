import { GoogleGenAI, Chat, Modality, Content } from "@google/genai";
import type { ImageFile, ThinkingMode, Message } from "../types";
import { fileToGenerativePart } from "../utils/fileUtils";

// Per guidelines, API key must be from process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Creates a new chat session with the Gemini model.
 * @param thinkingMode - The selected thinking mode which adjusts model parameters.
 * @param history - The past messages in the chat to provide context.
 * @returns A Chat instance.
 */
export const createChatSession = (thinkingMode: ThinkingMode, history: Message[]): Chat => {
  const model = 'gemini-2.5-flash';
  
  let config: any = {};

  switch (thinkingMode) {
    case 'Light':
      // Per guidelines, for low latency, disable thinking with thinkingBudget: 0
      config = { 
        thinkingConfig: { thinkingBudget: 0 },
        systemInstruction: "You are a helpful assistant. Keep your answers concise and to the point."
      };
      break;
    case 'Deep Thought':
      // Use parameters that encourage more diverse and imaginative output.
      config = { 
        tools: [{googleSearch: {}}],
        temperature: 0.9, 
        topP: 0.95, 
        topK: 64,
        systemInstruction: "You are a world-class expert and advanced reasoner. Break down complex problems into smaller, manageable steps. Think logically and thoroughly to provide comprehensive, in-depth, and accurate answers. Use your search tool to find the most current and relevant information to support your reasoning. Explain your reasoning process clearly."
      };
      break;
    case 'Code Master':
        config = {
            tools: [{googleSearch: {}}],
            systemInstruction: "You are Deepseek Coder, a powerful AI programming assistant. Your strengths are in understanding complex coding requests, generating high-quality, efficient, and well-documented code in multiple languages. You excel at providing runnable examples, explaining code logic clearly, and offering insights into best practices, debugging, and optimization. Use your search tool to access the latest documentation and real-world examples to ensure your code is up-to-date. Fulfill the user's request with precision and expertise."
        };
        break;
    case 'Search':
       // Per guidelines, use the googleSearch tool for up-to-date info.
      config = { 
          tools: [{googleSearch: {}}],
          systemInstruction: "You are an expert researcher. You MUST use the Google Search tool to find the most current and relevant information to answer the user's query. Prioritize real-time data, news, and recent developments. Do not rely on your internal knowledge for topics that may have changed. Cite your sources."
      };
      break;
    default:
      // Default config enables thinking for higher quality.
      config = {};
      break;
  }

  // FIX: Convert app's message format to the Gemini API's Content format for history.
  const chatHistory: Content[] = history.map(msg => ({
      role: msg.role === 'USER' ? 'user' : 'model',
      // Ensure there's always text content, even if empty, for API compatibility.
      parts: [{ text: msg.text || "" }]
  }));


  const chat: Chat = ai.chats.create({
    model: model,
    config: config,
    history: chatHistory,
  });

  return chat;
};

/**
 * Generates an image from a text prompt.
 * @param prompt The text prompt describing the image.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns An array with a single base64 encoded string of the generated image.
 */
export const generateImage = async (prompt: string, aspectRatio: string): Promise<string[]> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        },
    });

    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
};

/**
 * Edits an existing image based on a text prompt.
 * @param prompt The text prompt describing the edits.
 * @param image The source image file to edit.
 * @returns A single base64 encoded string of the generated image.
 */
export const editImage = async (prompt: string, image: ImageFile): Promise<string> => {
    const imagePart = await fileToGenerativePart(image.file, image.type);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }

    throw new Error("The AI did not return an image. Please try a different prompt.");
};

/**
 * Generates a video from a text prompt.
 * @param prompt The text prompt describing the video.
 * @param resolution The desired resolution of the video.
 * @returns A local blob URL for the generated video.
 */
export const generateVideo = async (prompt: string, resolution: string): Promise<string> => {
    // Note: VEO API doesn't have an explicit resolution parameter.
    // We include it in the prompt as a common technique to influence the output.
    const fullPrompt = `${prompt}, ${resolution}, cinematic quality`;

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: fullPrompt,
        config: {
            numberOfVideos: 1,
        }
    });

    // Poll for the result, per documentation guidelines.
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was provided.");
    }
    
    // Per documentation, we must append the API key to the download URI.
    const videoApiResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoApiResponse.ok) {
        throw new Error(`Failed to download the generated video. Status: ${videoApiResponse.statusText}`);
    }

    // Create a local URL for the video to avoid exposing the API key in the DOM.
    const videoBlob = await videoApiResponse.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    return videoUrl;
};