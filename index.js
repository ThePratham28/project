import "dotenv/config";
import express from "express";
import { connection } from "./db/database.js";
import authRouter from "./routes/auth.route.js";

import cron from "node-cron";
import fs from "fs";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./swagger.js";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(morgan("common"));

cron.schedule("* * * * *", () => {
	// console.log("Task running every minute:", new Date().toLocaleString());

	const log = `Summary at ${new Date().toLocaleString()}: Generated report here\n`;
	console.log(log);
	fs.appendFileSync("activity-log.txt", log);
});

app.use("/auth", authRouter);

app.listen(3000, async () => {
	try {
		await connection;
		console.log(`MongoDB connected: ${process.env.CONNECTION_STRING}`);
		console.log("Server started on: http://localhost:3000");
	} catch (err) {
		console.error("Error occurred connecting db", err.message);
	}
});
