import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "User Auth documentation",
			version: "1.0.0",
			description: "API Documentation user authentication endpoint",
		},
	},
	apis: ["./routes/*.js"], // Path to your route files
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
