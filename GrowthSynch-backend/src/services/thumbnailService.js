import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { logError, logWarn } from "../utils/logger.js";

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
});

const IMAGE_MODEL_ID =
  process.env.BEDROCK_IMAGE_MODEL_ID || "amazon.nova-canvas-v1:0";
const DEFAULT_S3_REGION = process.env.S3_REGION || process.env.AWS_REGION;
const SIGNED_URL_EXPIRES_IN = Number(process.env.S3_SIGNED_URL_TTL || 86400);

const createS3Client = (region) =>
  new S3Client({
    region,
  });

const isContentFilterError = (error) => {
  const text = `${error?.name || ""} ${error?.message || ""}`.toLowerCase();
  return text.includes("content filter") || text.includes("blocked");
};

const sanitizePrompt = (input) => {
  const blockedTerms = [
    "blood",
    "gore",
    "weapon",
    "gun",
    "knife",
    "violent",
    "nude",
    "nudity",
    "nsfw",
    "hate",
    "drugs",
  ];

  let cleaned = String(input || "");
  for (const term of blockedTerms) {
    cleaned = cleaned.replace(new RegExp(`\\b${term}\\b`, "gi"), "");
  }

  return cleaned
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
};

const invokeImageModel = async (prompt) => {
  const body = JSON.stringify({
    taskType: "TEXT_IMAGE",
    textToImageParams: {
      text: prompt,
    },
    imageGenerationConfig: {
      numberOfImages: 1,
      height: 1024,
      width: 1024,
      cfgScale: 8,
    },
  });

  const command = new InvokeModelCommand({
    modelId: IMAGE_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body,
  });

  const response = await bedrock.send(command);

  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const base64Image =
    responseBody?.images?.[0] ||
    responseBody?.artifacts?.[0]?.base64 ||
    responseBody?.output?.[0]?.image;

  if (!base64Image) {
    throw new Error(
      responseBody?.error || "Image model did not return image data",
    );
  }

  return base64Image;
};

export const generateThumbnailImage = async (prompt, options = {}) => {
  const safeTitle = sanitizePrompt(options?.title || "YouTube growth strategy");
  const safeMood = sanitizePrompt(options?.mood || "cinematic");
  const safeColors = sanitizePrompt(options?.colorPreference || "high contrast");
  const safeDescription = sanitizePrompt(options?.userDescription || "");
  const variationTag = uuidv4().slice(0, 8);
  const originalPrompt = sanitizePrompt(prompt);
  const fallbackPrompt1 = `${safeTitle}, ${safeMood} mood, ${safeColors}, professional YouTube thumbnail style, clean background, cinematic lighting, no violence, no sensitive content, no text overlay, variation ${variationTag}`;
  const fallbackPrompt2 = `YouTube thumbnail concept about ${safeTitle}. ${safeDescription || "Focus on symbolic elements related to the topic."} Style: ${safeMood}, ${safeColors}, high clarity, dynamic composition, safe and non-violent, no explicit content, variation ${variationTag}`;

  const attempts = [originalPrompt, fallbackPrompt1, fallbackPrompt2].filter(
    Boolean,
  );

  let base64Image = null;
  let lastError = null;
  let promptUsed = attempts[0];

  for (let index = 0; index < attempts.length; index += 1) {
    const candidate = attempts[index];
    promptUsed = candidate;
    try {
      base64Image = await invokeImageModel(candidate);
      break;
    } catch (error) {
      lastError = error;
      if (!isContentFilterError(error)) {
        throw error;
      }
      logWarn("Thumbnail prompt blocked by content filter; retrying", {
        attempt: index + 1,
        modelId: IMAGE_MODEL_ID,
      });
    }
  }

  if (!base64Image) {
    const error = new Error(
      "Thumbnail prompt blocked by content filters. Try a more neutral title/description.",
    );
    error.statusCode = 422;
    error.details = { modelId: IMAGE_MODEL_ID };
    logError("All thumbnail generation attempts were blocked", lastError, {
      modelId: IMAGE_MODEL_ID,
    });
    throw error;
  }

  const buffer = Buffer.from(base64Image, "base64");

  const key = `growthsync/${uuidv4()}.png`;
  const bucket = process.env.S3_BUCKET;
  let uploadRegion = DEFAULT_S3_REGION;

  const putCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: "image/png",
  });

  try {
    await createS3Client(uploadRegion).send(putCommand);
  } catch (error) {
    const redirectedRegion =
      error?.$response?.headers?.["x-amz-bucket-region"] ||
      error?.BucketRegion;

    if (error?.name !== "PermanentRedirect" || !redirectedRegion) {
      throw error;
    }

    uploadRegion = redirectedRegion;
    await createS3Client(uploadRegion).send(putCommand);
  }

  const getCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(
    createS3Client(uploadRegion),
    getCommand,
    {
      expiresIn: SIGNED_URL_EXPIRES_IN,
    },
  );

  return {
    thumbnailUrl: signedUrl,
    promptUsed,
  };
};
