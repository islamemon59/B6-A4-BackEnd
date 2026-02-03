import { boolean, email } from "better-auth/*";

declare global{
  namespace Express{
    interface Request{
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
      }
    }
  }
}


enum UserStatus {
  BAN,
  UNBAN,
}


type CreateBookingPayload = {
  tutorProfileId: string;
  availabilitySlotId: string;
  subject: string;
};