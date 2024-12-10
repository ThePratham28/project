import { connect } from "mongoose";
import "dotenv/config";

export const connection = connect(process.env.CONNECTION_STRING);
