import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

const jwt_passwd = process.env.JWT_PASSWORD;
const generateToken = (user) => {
	return jwt.sign({ _id: user._id, email: user.email }, jwt_passwd, {
		expiresIn: "1h",
	});
};
// const verifyToken = (token) => {
// 	return jwt.verify(token, jwt_passwd);
// };

export const registerUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const saltRounds = 7;
		const hashPasswd = await bcrypt.hash(password, saltRounds);

		const user = new User({
			username: username,
			email: email,
			password: hashPasswd,
		});
		await user.save();

		res.json({
			username,
			msg: "User registered successfully!",
		});
	} catch (e) {
		console.error(e);
		res.status(500).send("Something went wrong:");
	}
};

export const userLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).send("User Not Found");
		}

		const verifiedUser = await bcrypt.compare(password, user.password);

		if (verifiedUser) {
			const token = generateToken(user);

			res.json({ token });
		} else {
			res.status(401).json({ message: "Invalid credentials" });
		}
	} catch (e) {
		console.error(e);
		res.send("Error Something went wrong");
	}
};
