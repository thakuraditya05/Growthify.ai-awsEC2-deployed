import "dotenv/config";
import dns from "node:dns";
import app from "./src/app.js";
import cron from "node-cron";
import { runAllCronJobs } from "./src/controllers/cronController.js";
import { connectDatabases } from "./db.js";

const PORT = process.env.PORT || 5000;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const startServer = async () => {
  try {
    await connectDatabases();
    console.log("Both databases connected (MONGO_URI + DOCDB_URI)");

    try {
      await runAllCronJobs();
    } catch (err) {
      console.error("Initial Cron Run Error:", err);
    }

    cron.schedule("*/30 * * * *", runAllCronJobs);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    if (error?.name === "MongoServerSelectionError") {
      console.error(
        "DB unreachable. Check URI, SG/VPC rules, or SSH tunnel for DocumentDB.",
      );
    }

    if (error?.message?.includes("Hostname/IP does not match certificate")) {
      console.error(
        "TLS hostname mismatch detected. For localhost SSH tunnel use tlsAllowInvalidHostnames=true.",
      );
    }

    console.error("Startup error:", error);
    process.exit(1);
  }
};

startServer();
