import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { logError } from "../utils/logger.js";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});

const TEXT_MODEL_ID =
  process.env.BEDROCK_TEXT_MODEL_ID || "amazon.nova-lite-v1:0";

const extractTextFromModelResponse = (responseBody) => {
  if (responseBody?.output?.message?.content?.length) {
    return responseBody.output.message.content
      .map((part) => part?.text || "")
      .join("")
      .trim();
  }

  if (responseBody?.results?.[0]?.outputText) {
    return responseBody.results[0].outputText.trim();
  }

  throw new Error("Unable to parse text model response");
};

export const generateTextFromAI = async ({
  prompt,
  maxTokens = 700,
  temperature = 0.7,
  topP = 0.9,
}) => {
  try {
    const body = JSON.stringify({
      schemaVersion: "messages-v1",
      messages: [
        {
          role: "user",
          content: [{ text: prompt }],
        },
      ],
      inferenceConfig: {
        max_new_tokens: maxTokens,
        temperature,
        top_p: topP,
      },
    });

    const command = new InvokeModelCommand({
      modelId: TEXT_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body,
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return extractTextFromModelResponse(responseBody);
  } catch (error) {
    logError("Bedrock text generation failed", error, {
      modelId: TEXT_MODEL_ID,
      promptPreview: prompt?.slice(0, 300),
    });
    throw error;
  }
};

export const generateContentFromAI = async ({
  topic,
  platform,
  niche,
  promptType,
}) => {
  const prompt = `
Generate social media content.

Topic: ${topic}
Platform: ${platform}
Niche: ${niche}
Style: ${promptType}

Return ONLY valid JSON with this exact shape:
{
  "hook": "string",
  "script": "string",
  "title": "string",
  "description": "string",
  "hashtags": ["#tag1", "#tag2"]
}
`;

  return generateTextFromAI({
    prompt,
    maxTokens: 700,
    temperature: 0.7,
    topP: 0.9,
  });
};
