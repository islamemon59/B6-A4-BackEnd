import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors"
import { auth } from "./lib/auth";
const app = express()

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
}))

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server working perfectly🙂')
})



export default app;