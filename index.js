import "dotenv/config";
import express from "express";
import { connection } from "./db/database.js";
import authRouter from "./routes/auth.route.js";

const app = express();
app.use(express.json({ limit: "2mb" }));
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
