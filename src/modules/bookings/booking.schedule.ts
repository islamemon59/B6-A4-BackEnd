import cron from "node-cron";
import { prisma } from "../../lib/prisma";

export function startBookingAutoCompleteJob() {
  // every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      await prisma.booking.updateMany({
        where: {
          status: "CONFIRMED",
          endTime: { lte: now },
        },
        data: { status: "COMPLETED" },
      });
    } catch (e) {
      console.error("Auto-complete job failed:", e);
    }
  });
}
