import jwt from "jsonwebtoken";
import "dotenv/config.js";

const jwt_passwd = process.env.JWT_PASSWORD;

export const authMiddleware = (req, res, next) => {
	const token = req.headers["authorization"];

	if (!token) {
		res.status(401).json({
			warning: "Unauthorized access",
		});
	}

	try {
		jwt.verify(token, jwt_passwd);
		next();
	} catch {
		res.status(401).json({
			warning: "Unauthorized access",
		});
	}
};
