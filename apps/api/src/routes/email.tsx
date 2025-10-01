import { Hono } from "hono";
import { Resend } from "resend";

import { createVerificationToken } from "../lib/auth";
import { AccountVerification } from "@bunstack/api/emails/account-verification";
import { env } from "@bunstack/api/lib/env";
import { getAuthContext } from "@bunstack/api/middlewares/auth";

const resend = new Resend(env.RESEND_API_KEY);

export default new Hono()
  .use(getAuthContext)

  /**
   * Send account verification email
   * @param c - The context
   * @returns Response containing success status and email data or error
   */
  .post("/send-account-verification", async (c) => {
    const { user } = c.var.authContext;

    const verificationToken = await createVerificationToken(user.id);
    const confirmationLink = `http://localhost:4000/auth/verify-account?token=${encodeURIComponent(verificationToken)}`;

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [user.email],
      subject: "An action is required",
      react: <AccountVerification name={user.name} link={confirmationLink} />,
    });

    if (error) {
      return c.json({ success: false as const, error }, 400);
    }

    return c.json({ success: true as const, data });
  });
