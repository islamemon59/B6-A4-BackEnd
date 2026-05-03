-- Add missing tutor rating aggregate field used by the public filters and cards
ALTER TABLE "tutor_profiles"
ADD COLUMN "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Backfill ratings from existing reviews
UPDATE "tutor_profiles" tp
SET
  "ratingAvg" = COALESCE(stats.avg_rating, 0),
  "ratingCount" = COALESCE(stats.review_count, 0)
FROM (
  SELECT
    "tutorProfileId",
    ROUND(AVG("rating")::numeric, 1)::double precision AS avg_rating,
    COUNT(*)::integer AS review_count
  FROM "reviews"
  GROUP BY "tutorProfileId"
) stats
WHERE stats."tutorProfileId" = tp."id";

-- Enforce the user relationships that the application already depends on
ALTER TABLE "tutor_profiles"
ADD CONSTRAINT "tutor_profiles_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "reviews"
ADD CONSTRAINT "reviews_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
