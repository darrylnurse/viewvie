import * as dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.PINECONE_API_KEY;

console.log(API_KEY)