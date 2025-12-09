import { Hono } from "hono";
import { Resend } from "resend";

import { createVerificationToken, VERIFICATION_TOKEN_EXPIRATION_SECONDS } from "../lib/auth";
import { UserVerification } from "@bunstack/api/emails/user-verification";
import { env } from "@bunstack/api/lib/env";
import { getAuthContext } from "@bunstack/api/middlewares/auth";
import { insertToken } from "@bunstack/db/queries/tokens";

const resend = new Resend(env.RESEND_API_KEY);

export const emailRoutes = new Hono()

  // --- All routes below this point require authentication
  .use(getAuthContext)

  /**
   * Send account verification email
   * @param c - The context
   * @returns Response containing success status and email data or error
   */
  .post("/send-account-verification", async (c) => {
    const { user } = c.var.authContext;

    if (user.verifiedAt) {
      return c.json({ success: false, error: "Already verified" });
    }

    const insertedToken = await insertToken({
      userId: user.id,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRATION_SECONDS * 1000).toISOString(),
    });

    const verificationToken = await createVerificationToken(user.id, insertedToken.id);
    // AUTH_URL points to dashboard where /verify route is hosted
    const confirmationLink = `${env.AUTH_URL}/verify?token=${verificationToken}`;

    const { data, error } = await resend.emails.send({
      from: `Bunstack <${env.NO_REPLY_EMAIL}>`,
      to: [user.email],
      subject: "Verify your Bunstack account",
      react: <UserVerification name={user.name} link={confirmationLink} />,
    });

    if (error) {
      return c.json({ success: false as const, error }, 400);
    }

    return c.json({ success: true as const, data });
  });
