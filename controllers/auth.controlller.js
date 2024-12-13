import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "node:crypto";

const jwt_passwd = process.env.JWT_PASSWORD;

const generateToken = (user) => {
	return jwt.sign({ _id: user._id, email: user.email }, jwt_passwd, {
		expiresIn: "1h",
	});
};
const refreshToken = (user) => {
	return jwt.sign({ _id: user._id }, jwt_passwd);
};

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
			const accesstoken = generateToken(user);
			const refreshtoken = refreshToken(user);

			user.refreshToken = refreshToken;
			await user.save();

			res.json({ accesstoken, refreshtoken });
		} else {
			res.status(404).json({ message: "Invalid credentials" });
		}
	} catch (e) {
		console.error(e);
		res.send("Error Something went wrong");
	}
};

export const verifyRfTOken = async (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return res.send("RefreshToken required");
	}

	try {
		const user = await User.findOne({ refreshToken });

		if (!user) {
			return res.send("Invalid refresh token");
		}

		jwt.verify(refreshToken, jwt_passwd, (err, decoded) => {
			if (err) {
				res.send("Invalid token");
			}

			const newAccessToken = generateToken({ _id: decoded._id });
			res.json({ newAccessToken });
		});
	} catch (err) {
		res.json({
			error: "Invalid refresh token",
			err,
		});
	}
};

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "theodore.simonis53@ethereal.email",
		pass: "3KSBbb24qRzbUPUqwC",
	},
});

export const forgotPasswd = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
	} catch (err) {
		res.status(500).json({
			msg: "Something went wrong",
			err,
		});
	}
};

export const resetPasswd = async (req, res) => {};
