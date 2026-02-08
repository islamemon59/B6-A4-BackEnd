import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";
import { tutorRouter } from "./modules/tutor/tutor.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { studentRouter } from "./modules/student/student.routes";
import { publicRouter } from "./modules/public/public.routes";
import { startBookingAutoCompleteJob } from "./modules/bookings/booking.schedule";
const app = express();
app.use(express.json());

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.APP_URL || "https://b6-a4-front-end.vercel.app",
  process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api", tutorRouter);
app.use("/api", adminRouter);
app.use("/api", studentRouter);
app.use("/api", publicRouter);

startBookingAutoCompleteJob();

app.get("/", (req, res) => {
  res.send("Server working perfectly🙂");
});

export default app;
