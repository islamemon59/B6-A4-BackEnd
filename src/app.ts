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

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api", tutorRouter);
app.use("/api", adminRouter);
app.use("/api", studentRouter);
app.use("/api", publicRouter);

startBookingAutoCompleteJob();

app.get("/", (req, res) => {
  res.send("Server working perfectly🙂");
});

export default app;
