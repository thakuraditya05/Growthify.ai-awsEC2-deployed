import "dotenv/config";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_TIMEOUT_MS = Number(
  process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 15000,
);

export const atlasConnection = mongoose.createConnection();
export const docDbConnection = mongoose.createConnection();

const withListeners = (conn, label) => {
  conn.on("connected", () => console.log(`${label} connected`));
  conn.on("error", (err) =>
    console.error(`${label} error:`, err?.message || err),
  );
  conn.on("disconnected", () => console.warn(`${label} disconnected`));
};

const ensureDocDbAuthMechanism = (uri) => {
  if (!uri) return uri;
  const match = uri.match(/authMechanism=([^&]+)/i);
  if (!match) {
    const sep = uri.includes("?") ? "&" : "?";
    return `${uri}${sep}authMechanism=SCRAM-SHA-1`;
  }

  const current = decodeURIComponent(match[1]).toUpperCase();
  if (current === "MONGODB-AWS" || current === "SCRAM-SHA-1") {
    return uri;
  }

  return uri.replace(/authMechanism=[^&]+/i, "authMechanism=SCRAM-SHA-1");
};

const getDocDbOptions = (docDbUri) => {
  const options = {
    serverSelectionTimeoutMS: DEFAULT_TIMEOUT_MS,
    retryWrites: false,
  };

  const tunnelHost = /@(?:localhost|127\.0\.0\.1):27017/i.test(docDbUri);
  if (tunnelHost) {
    options.tlsAllowInvalidHostnames = true;
  }

  const certFromEnv = process.env.DOCDB_CA_FILE;
  const fallbackCert = path.join(__dirname, "global-bundle.pem");
  const certPath = certFromEnv || fallbackCert;

  if (fs.existsSync(certPath)) {
    options.tlsCAFile = certPath;
  }

  return options;
};

export const connectDatabases = async () => {
  const atlasUri = process.env.MONGO_URI;
  const rawDocDbUri = process.env.DOCDB_URI;
  const docDbUri = ensureDocDbAuthMechanism(rawDocDbUri);

  if (!atlasUri) {
    throw new Error("MONGO_URI is missing in environment");
  }

  if (!rawDocDbUri) {
    throw new Error("DOCDB_URI is missing in environment");
  }

  withListeners(atlasConnection, "Atlas");
  withListeners(docDbConnection, "DocumentDB");

  await atlasConnection.openUri(atlasUri, {
    serverSelectionTimeoutMS: DEFAULT_TIMEOUT_MS,
  });

  await docDbConnection.openUri(docDbUri, getDocDbOptions(docDbUri));

  return {
    atlasConnection,
    docDbConnection,
  };
};
